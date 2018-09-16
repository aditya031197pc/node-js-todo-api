const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo.model');
const { User } = require('./models/user.model');

const port = process.env.PORT || 3000;  // this is to set up the port for heroku

const app = express();

// body parser is a middleware that takes JSON and converts it to object for attaching on to the req object
// app.use is used to configure middleware
// for custom middlewares we pass a function, else something off a third party module
app.use(bodyParser.json());
// return value of .json is a funciton that is actually used as a middleware
// we can now send json to our application


// creating a todo on a post request
app.post('/todos', (req, res) => {
    // console.log(req.body);
    let newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});


// returning all todos using get request
app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({ todos });
    }, err => {
        res.status(400).send(err);
    });
});


// handling a request for a particular todo by its id

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
        // if the objectID requested is invalid
        return res.status(404).send(); // we send nothing back here
    } 
    Todo.findById(id).then((todo) => {
        if(!todo) {
            // if id does not exist in Database
            return res.status(404).send({}); // we send an empty object here
        }
        // if the id exists
        res.send({todo});
    }).catch(e => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
        // if the objectID requested is invalid
        return res.status(404).send(); // we send nothing back here
    } 
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            // if id does not exist in Database
            return res.status(404).send({}); // we send an empty object here
        }
        // if the id exists
        res.send({todo});
    }).catch(e => res.status(400).send());
});

app.listen(port, () => { console.log('Server running at port ' + port); });

module.exports = { app };