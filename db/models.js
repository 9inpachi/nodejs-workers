const mongoose = require('mongoose');

// Schema for user - simpler for the sake of task
const userSchema = mongoose.Schema({
    email: String,
    meta: Object
});

// User model
const userModel = mongoose.model('User', userSchema, 'users');

module.exports = {
    userModel
};