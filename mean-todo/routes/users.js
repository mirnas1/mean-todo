const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

router.post('/register', async (req, res) => {
    let { name, email, username, password } = req.body;
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
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "Username already exists" });
        }
        const savedUser = await User.addUser(newUser);
        res.json({ success: true, user: savedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to register user" });
    }
});

router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (isMatch) {
            const payload = {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            };
            const token = jwt.sign(payload, config.secret, {
                expiresIn: 604800 // 1 week of seconds woaaaah
            });

            res.json({
                success: true,
                token: 'JWT ' + token, 
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
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        user: req.user
    });
});

module.exports = router;
