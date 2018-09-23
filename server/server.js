require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo.model');
const { User } = require('./models/user.model');
const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;  // this is to set up the port for heroku

const app = express();

// body parser is a middleware that takes JSON and converts it to object for attaching on to the req object
// app.use is used to configure middleware
// for custom middlewares we pass a function, else something off a third party module
app.use(bodyParser.json());
// return value of .json is a funciton that is actually used as a middleware
// we can now send json to our application


// creating a todo on a post request
app.post('/todos', authenticate, (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});


// returning all todos using get request
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(todos => {
        res.send({ todos });
    }, err => {
        res.status(400).send(err);
    });
});


// handling a request for a particular todo by its id

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        // if the objectID requested is invalid
        return res.status(404).send(); // we send nothing back here
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            // if id does not exist in Database
            return res.status(404).send({}); // we send an empty object here
        }
        // if the id exists
        res.send({ todo });
    }).catch(e => res.status(400).send());
});

// deleting a particular todo using its id

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        // if the objectID requested is invalid
        return res.status(404).send(); // we send nothing back here
    }
    const some = Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }, (err, todo) => {
        if (err) {
            res.status(400).send()
        }
        if (!todo) {
            return res.status(404).send({}); // we send an empty object here
        }
        res.send({ todo });
    });
});

// updating a todo only allowing text and completed field to be updated

app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']); // the user can only modify these properties
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); // the time is set when the request is sent
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch(e => res.status(404).send());
});

// POST /users 
// signing up a user
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => user.generateAuthToken()) // here we are returning a promise already chained with a then call instead of a promise
        .then(token => res.header('x-auth', token).send(user))
        .catch(e => res.status(400).send(e));
});


// GET /users/me  authenticating and getting the user back
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login
// logging in a user
app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateAuthToken().then((token) => { // using return here keeps the chain alive ie in case of any errors the catch phrase will be executed
                res.header('x-auth', token).send(user);
            });
        }).catch((e) => {
            res.status(400).send();
        });
});

// DELETE /users/me/token
// deleting the token to logout user

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => { console.log('Server running at port ' + port); });

module.exports = { app };