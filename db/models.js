const mongoose = require('mongoose');

// Schema for user - simpler for the sake of task
const userSchema = mongoose.Schema({
    email: String,
    meta: Object
});

const jobsSchema = mongoose.Schema({
    classifyUsersTimeDecrement: Number
});

// User model
const userModel = mongoose.model('User', userSchema, 'users');
const jobsModel = mongoose.model('Jobs', jobsSchema, 'jobs');

module.exports = {
    userModel,
    jobsModel
};