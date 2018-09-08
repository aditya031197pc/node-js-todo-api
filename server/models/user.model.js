const mongoose = require('mongoose');

// creating a User Model
const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});


module.exports = {User};
