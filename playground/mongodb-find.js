const {MongoClient, ObjectID} = require('mongodb');


// here first one might be an amazon web services url or heroku url
MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err, db) => {
    if(err) {
      return console.log('unable to connect to the mongoDB server');
    }
    console.log('connected to MongoDB server');

    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(docs);
    }, (err) => {
        console.log('unable to retrieve data');
    });

    // db.close();
});