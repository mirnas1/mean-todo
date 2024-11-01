const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    }
});



/**
 * get user by id
 * @param {String} id - id
 * @returns {Promise<Object>} 
 */
UserSchema.statics.getUserById = async function(id) {
    try {
        return await this.findById(id);
    } catch (err) {
        throw err;
    }
};

/**
 * get user by username
 * @param {String} username - username
 * @returns {Promise<Object>} - 
 */
UserSchema.statics.getUserByUsername = async function(username) {
    try {
        return await this.findOne({ username });
    } catch (err) {
        throw err;
    }
};

/**
 * add a new user
 * @param {Object} newUser - new user
 * @returns {Promise<Object>} - 
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
 * comparing passwords
 * @param {String} candidatePassword - password entered by the user
 * @param {String} hashedPassword - hashed password stored in the database
 * @returns {Promise<Boolean>} 
 */
UserSchema.statics.comparePassword = async function(candidatePassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
