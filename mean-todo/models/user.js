const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure emails are unique
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensure usernames are unique
    },
    password: {
        type: String,
        required: true
    }
});

// Static Methods

/**
 * Get User by ID
 * @param {String} id - User ID
 * @returns {Promise<Object>} - Returns the user object if found
 */
UserSchema.statics.getUserById = async function(id) {
    try {
        return await this.findById(id);
    } catch (err) {
        throw err;
    }
};

/**
 * Get User by Username
 * @param {String} username - Username
 * @returns {Promise<Object>} - Returns the user object if found
 */
UserSchema.statics.getUserByUsername = async function(username) {
    try {
        return await this.findOne({ username });
    } catch (err) {
        throw err;
    }
};

/**
 * Add a New User
 * @param {Object} newUser - New user object
 * @returns {Promise<Object>} - Returns the saved user object
 */
UserSchema.statics.addUser = async function(newUser) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        return await newUser.save();
    } catch (err) {
        throw err;
    }
};

/**
 * Compare Passwords
 * @param {String} candidatePassword - Password entered by the user
 * @param {String} hashedPassword - Hashed password stored in the database
 * @returns {Promise<Boolean>} - Returns true if passwords match, else false
 */
UserSchema.statics.comparePassword = async function(candidatePassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

// Create and Export the User Model
const User = mongoose.model('User', UserSchema);
module.exports = User;
