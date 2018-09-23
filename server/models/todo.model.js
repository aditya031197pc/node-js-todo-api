const mongoose = require('mongoose');

// creating a todo model
const TodoSchema = new mongoose.Schema({
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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};