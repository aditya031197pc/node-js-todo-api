const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo.model');
const { User } = require('./../../models/user.model');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'aditya@example.com',
    password: 'useronepass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'gen@example.com',
    password: 'usertwopass'
}];

const todos = [{
    _id: new ObjectID(),
    text: "dummy todo one"
}, {
    _id: new ObjectID(),
    text: "dummy todo two",
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => { // done is required for async tasks
    Todo.remove({}) // method to remove all the docs in Todo collection
        .then(() => Todo.insertMany(todos)) // tweaking the db for testing GET /todos route
        .then(() => done());
};

// we need to tweak this function to save the hashed password only
const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save(); // this was required so that the middleware is run to hash passwords
            const userTwo = new User(users[1]).save();
            // Promise.all takes an array of promises and when all the promises get resolved , 'then' is executed
            return Promise.all([userOne, userTwo]);
        }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};
