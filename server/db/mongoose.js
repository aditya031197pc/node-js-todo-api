const mongoose = require('mongoose');

// setting up mongoose to use promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};