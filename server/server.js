const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo.model');
let { User } = require('./models/user.model');

let app = express();

// body parser is a middleware that takes JSON and converts it to object for attaching on to the req object
// app.use is used to configure middleware
// for custom middlewares we pass a function, else something off a third party module
app.use(bodyParser.json());
// return value of .json is a funciton that is actually used as a middleware
// we can now send json to our application

app.post('/todos', (req, res) => {
    console.log(req.body);
    let newTodo = new Todo({
        text: req.body.text
    });
    
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })

});


app.listen(3000, () => { console.log('Server running at port ' + 3000); });