const {MongoClient, ObjectID} = require('mongodb');


// here first one might be an amazon web services url or heroku url
MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err, db) => {
    if(err) {
      return console.log('unable to connect to the mongoDB server');
    }
    console.log('connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('unable to insert todo', err);
    //     } else {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // });

    db.collection('Users').insertOne({
        name: 'Aditya',
        age: 22,
        location: 'Ghaziabad'
    }, (err, result) => {
        if(err) {
            return console.log('unable to insert user', err);
        } else {
            console.log(JSON.stringify(result.ops, undefined, 2));
        }
    });

    db.close();
});