const mongoose = require('mongoose');

// setting up mongoose to use promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect('mongodb://demotodoappuser:2doapi@ds139919.mlab.com:39919/todoapp');
// console.log('Connected');
module.exports = {mongoose};