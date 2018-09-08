const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to the mongoDB server');
    }
    console.log('connected to MongoDB server');
// delete many
    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // }, err => {
    //     console.log('Couldnt delete data', err);
    // });

    
    db.collection('Users').deleteMany({name: 'Aditya'}).then((result) => {
        console.log(result);
    }, err => {
        console.log('Couldnt delete data', err);
    });

// delete one
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // }, err => {
    //     console.log('Couldnt delete data', err);
    // });

    
    // db.collection('Users').deleteOne({name: 'Aditya'}).then((result) => {
    //     console.log(result);
    // }, err => {
    //     console.log('Couldnt delete data', err);
    // });

// findOne and delete // 
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // }, err => {
    //     console.log('Couldnt delete data', err);
    // });

    
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b876324d8e41a04a46f2bcc')}).then((result) => {
        console.log(result);
    }, err => {
        console.log('Couldnt delete data', err);
    });

    db.close();
});