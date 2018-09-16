const mongoose = require('mongoose');

// setting up mongoose to use promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ToDoApp');
// mongoose.connect('mongodb://demotodoappuser:2doapi@ds139919.mlab.com:39919/todoapp');
// console.log('Connected');
module.exports = {mongoose};