const mongoose = require('mongoose');

// setting up mongoose to use promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
// mongoose.connect('mongodb://demotodoappuser:2doapi@ds139919.mlab.com:39919/todoapp', {useMongoClient: true});
console.log('Connected');
module.exports = { mongoose };