const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to the mongoDB server');
    }
    console.log('connected to MongoDB server');

    // find one and update takes following args: filter-condition, updated(using mongodb operators like $set),
    //  options(like return original) and lastly a callback which can be skipped to get a promise in return
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b87741156f9ead48f4077e1')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then ( (result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to update collection', err);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b93c776924164490ce905cb')
    }, {
        $set: {
            location: 'Lucknow'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then ( (result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update collection', err);
    });


    db.close();
});