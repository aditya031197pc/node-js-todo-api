const { MongoClient, ObjectID } = require('mongodb');


// here first one might be an amazon web services url or heroku url
MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to the mongoDB server');
    }
    console.log('connected to MongoDB server');

    // db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(docs);
    // }, (err) => {
    //     console.log('unable to retrieve data');
    // });
    
    
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`the no of entries is ${count}`);
    // }, (err) => {
    //     console.log('unable to retrieve data');
    // });
    
    // find returns a cursor and so it can be converted to array
    // but the to array method returns a promise of array of object we require
    db.collection('Users').find({name: 'Aditya'}).toArray().then((docs) => {
        console.log('Users');
        console.log(docs);
    }, (err) => {
        console.log('Unable to retrieve data', err);
    });
    
    db.close();
});