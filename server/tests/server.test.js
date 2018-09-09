const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.model');

const dummyTodos = [
    { text: "dummy todo one" },
    { text: "dummy todo two" }
];

//testing life cycle method beforeEach is used to run some code before each test case is executed
// eg in this case it is used to empty the database before each test

beforeEach((done) => { // done is required for async tasks
    Todo.remove({})
        .then(() => Todo.insertMany(dummyTodos)) // tweaking the db for testing GET /todos route
        .then(() => done()); // method to remove all the docs in Todo collection
});

// describe block groups helps us quicly glance through the test in groups

describe('POST /todos', () => {

    // TEST ONE: SHOULD CREATE A NEW TODO
    it('should create a new todo', (done) => {
        // done argument is necessary for async tasks to end the test


        // dummy todo:
        const text = 'Test todo text';

        //  testing adding a todo
        request(app)
            .post('/todos')
            .send({ text }) // automatically converted to json by body-parser

            .expect(200) // we expect the status code that comes back to be 200

            .expect((res) => {  // we expect a response object to come back    
                expect(res.body.text).toBe(text); // we check whether the body of the todo remains the same

            }).end((err, res) => { // in order to handle the error and to check what got stored in the mongodb

                if (err) {
                    return done(err); //err occurs if status not 200 or body text not present
                }

                Todo.find({ text }) // returns a promise for the todos with text = "Test todo text"

                    .then(todos => {
                        expect(todos.length).toBe(1); // need to empty database beforeEach test case
                        expect(todos[0].text).toBe(text);
                        done(); // if either of the above to errors occurs the test may still pass hence catch required

                    }).catch(err => done(err));

            });
    });

    // TEST TWO SHOULD NOT CREATE A NEW TODO WITH BAD REQUEST
    it('should not create a todo with bad data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get back all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2); // res.body object has a key todos that contains the todos array
            })
            .end(done);
        // since we are not doing anything asynchronously like retrieving data from database, we can call done here
    });
});