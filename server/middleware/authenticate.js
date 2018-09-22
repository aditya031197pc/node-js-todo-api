const { User } = require('./../models/user.model');

// we can now create a middleware
// so that now all the routes can take advantage of private route without having to write the boiler plate code again and again

const authenticate = (req, res, next) => { // the actual response will not be called unless next is called
    const token = req.header('x-auth');
    User.findByToken(token)
        .then((user) => {
            if (!user) {
                console.log('user not found');
                // if for some reason the user is verified but the query is unable to be processed
                return Promise.reject();
                // due to the above line, the then code will automatically stop and the control will go to catch block
            }

            req.user = user;
            req.token = token;
            next();  // without this call the request will not procede further
        }).catch(e => res.status(401).send()); // if the token is not verified
};

module.exports = {
    authenticate
};