const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.model');
const { User } = require('./../models/user.model');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');



//testing life cycle method beforeEach is used to run some code before each test case is executed
// eg in this case it is used to empty the database before each test and then add some dummy data
beforeEach(populateUsers);
beforeEach(populateTodos);

// describe block groups helps us quicKly glance through the test in groups

describe('POST /todos', () => {

    // TEST ONE: SHOULD CREATE A NEW TODO
    it('should create a new todo', (done) => {
        // done argument is necessary for async tasks to end the test


        // dummy todo:
        const text = 'Test todo text';

        //  testing adding a todo
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1); // res.body object has a key todos that contains the todos array
            })
            .end(done);
        // since we are not doing anything asynchronously like retrieving data from database, we can call done here
    });
});

// const validID = '5b942dd08e86bac4172d494f';
// const invalidID = '123';

describe('GET /todos/:id', () => {
    it('should return 404 invalid Id', (done) => {
        request(app)
            .get(`/todos/123`) // toHExString converts the objectId into a plain string
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for not found', (done) => {
        const id = new ObjectID();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return a todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should not return a todo created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404) // the user will not find the other users todo
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexID = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexID, (todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('should not remove a todo for antoher user', (done) => {
        const id = todos[0]._id;
        const hexID = id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById({
                    _id: id
                }, (err, todo) => { // this method takes 2 arguments the first one being error
                    expect(todo).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if invalid id', (done) => {
        const id = 123;;
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo to completed', (done) => {
        const id = todos[0]._id.toHexString();
        const newText = "This is new"
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text: newText
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(newText);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not update the todo to completed for another user', (done) => {
        const id = todos[0]._id.toHexString();
        const newText = "This is new"
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text: newText
            })
            .expect(404)
            .end(done);
    });

    it('should update todo to incomplete', (done) => {
        const id = todos[1]._id.toHexString();
        const newText = "This is new text"
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: false,
                text: newText
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token) //set method in supertest is used to set headers
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'example@example.com';
        const password = 'pass_word';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        const email = 'email';
        const password = '123';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should return a token for valid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                // we need to query the database for the test to be complete
                if (err) {
                    done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({ // the second token will match this
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 400 for invalid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: '123456'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1); //no extra token will be present
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});