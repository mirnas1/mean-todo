// routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Register Route
router.post('/register', async (req, res) => {
    let { name, email, username, password } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ success: false, msg: "Please provide all required fields" });
    }
    username = username.toLowerCase();


    const newUser = new User({
        name,
        email,
        username,
        password
    });

    try {
        // Check if the username already exists
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "Username already exists" });
        }

        // Add the user to the database
        const savedUser = await User.addUser(newUser);
        res.json({ success: true, user: savedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to register user" });
    }
});

// Authenticate Route
router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await User.comparePassword(password, user.password);
        if (isMatch) {
            // Create a JWT payload
            const payload = {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            };

            // Sign the token
            const token = jwt.sign(payload, config.secret, {
                expiresIn: 604800 // 1 week in seconds
            });

            res.json({
                success: true,
                token: 'JWT ' + token, // Note the space after 'JWT'
                user: payload
            });
        } else {
            return res.status(400).json({ success: false, msg: "Wrong password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Authentication failed" });
    }
});

// Profile Route (Protected)
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: req.user
    });
});

module.exports = router;
