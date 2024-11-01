const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    todo: {
        type: String,
        required: true,
    },
    is_completed: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['white', 'orange', 'red'],
        default: 'white',
    },
    order: {
        type: Number,
        default: Date.now(),
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);
