// routes/todos.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Todo = require('../models/todo');

// Middleware to check authentication
const requireAuth = passport.authenticate('jwt', { session: false });

// =======================
// Batch Update Todos Order
// =======================
router.put('/order', requireAuth, async (req, res) => {
    const { todos } = req.body;

    if (!Array.isArray(todos)) {
        return res.status(400).json({ success: false, msg: 'Invalid data format' });
    }

    try {
        const updatePromises = todos.map(todo => {
            return Todo.findOneAndUpdate(
                { _id: todo._id, userId: req.user._id },
                { order: todo.order },
                { new: true }
            );
        });

        const updatedTodos = await Promise.all(updatePromises);
        res.json({ success: true, todos: updatedTodos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Error updating todos order' });
    }
});

// =======================
// Get All Todos
// =======================
router.get('/', requireAuth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id }).sort({ order: 1 });
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Error fetching todos' });
    }
});

// =======================
// Add a New Todo
// =======================
router.post('/', requireAuth, async (req, res) => {
    const { todo, priority, order } = req.body;

    // Basic validation
    if (!todo) {
        return res.status(400).json({ success: false, msg: 'Todo text is required' });
    }

    try {
        const newTodo = new Todo({
            userId: req.user._id,
            todo,
            priority: priority || 'white',
            order: order || Date.now(),
        });

        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Error saving todo' });
    }
});

// =======================
// Update a Todo
// =======================
router.put('/:id', requireAuth, async (req, res) => {
    const { todo, is_completed, priority, order } = req.body;

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { todo, is_completed, priority, order },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ success: false, msg: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Error updating todo' });
    }
});

// =======================
// Delete a Todo
// =======================
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!deletedTodo) {
            return res.status(404).json({ success: false, msg: 'Todo not found' });
        }

        res.json({ success: true, msg: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Error deleting todo' });
    }
});

module.exports = router;
