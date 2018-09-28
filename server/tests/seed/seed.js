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
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'gen@example.com',
    password: 'usertwopass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "dummy todo one",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "dummy todo two",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
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
            const userOne = new User(users[0]).save() // this was required so that the middleware is run to hash passwords
            .then(() => {
                const userTwo = new User(users[1]).save();}); // doing this to maintain the order in which the users will be saved
            return Promise.all([userOne]);
        }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};
