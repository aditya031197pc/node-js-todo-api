const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
// creating a User Model

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true, // so that existing email cannot be used again
        validate: [{ isAsync: false, validator: validator.isEmail, msg: 'Invalid email.' }]
         // validator takes a function and passes the value to it and returns a boolean
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{  // diffferent tokens are needed for different platforms like mobile, web, etc 
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
        usePushEach: true
    });
// we created the schema to allow us more flexibility
// we can now add instance methods and model methods

// instance methods have access to the individual data
// we can now generate jwt tokens for each user

// we will not use arrow function as it does not bind 'this' and we need this to bind each user

UserSchema.methods.toJSON = function () { // we are overriding this function to hide some data that we send back
    const user = this;
    const userObject = user.toObject();  // this takes a mongoose variable and converts it to an object where properties available on the document only exist
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth'; // for web only 
    const token = jwt.sign({ _id: user._id, access }, 'abc123').toString(); // token generated using the token id

    // pushing the token created to tokens array
    // access will be different for different platforms
    user.tokens.push({ access, token });
    return user.save()
        .then(() => token); // a token is returned this will be chained by a then call in server.js
};

// model methods are applied on the model as statics
// the model methods get called by the entire model as 'this' binding
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded; // initially set to undefined

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject(); // when the token is not verified, then() will never be called in server.js and we can handle the error in catch
        // });

        // a simpler way to implement above commented code
        return Promise.reject(); // we can pass any arg to reject witch will be stored in 'e' in catch block in server.js
    }
    console.log(decoded);
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token, // the '' way is used to find in nested objects
        'tokens.access': 'auth'
    }); // we are returning a promise to be handled in serverjs
};

const User = mongoose.model('User', UserSchema);


module.exports = { User };
