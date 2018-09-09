const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo.model');
const { User } = require('./../server/models/user.model');

const todoId = '6b942dd08e86bac4172d494f';
const userId = '5b93da299178e8ec3ec38bf3';

// the ObjectID has various inbuilt functions like: 
if (!ObjectID.isValid(todoId)) {
    console.log('Id is not valid');
}

// find() lets us query by anything eg _id or text etc
// mongoose can itself convert string ids to ObjectIds
// if not found any it returns a promise of an empty array
Todo.find({
    _id: todoId
}).then(todos => console.log('Todos', todos),
    err => console.log(err));


// Similar to find but returns one document at most, the first matching one
// if not found it returns a promise of null
Todo.findOne({
    completed: false
}).then(todo => console.log('Todo', todo))
    .catch(err => console.log(err));


// To find a document based on its todoId
Todo.findById(todoId).then((todo) => {
    if (!todo) {
        return console.log('Id not found'); // if the todoId is not in database then we have to handle it separately
    }
    console.log('Todo by Id', todo)
});


// For users collection: 
User.findById(userId).then(
    (user) => {
        if (!user) {
            return console.log('User not found');
        }
        console.log(JSON.stringify(user, undefined, 2));
    }
).catch((e) => console.log(e));
