const mongoose = require('mongoose');

// creating a todo model
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        // validations:
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        // unix timestamp:
        type: Number,
        default: null
    }
});

module.exports = {Todo};