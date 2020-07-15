const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    meta: Object
});

const userModel = mongoose.model('User', userSchema, 'users');

module.exports = {
    userModel
};