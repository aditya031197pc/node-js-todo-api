// const {SHA256} = require('crypto-js');

// const user = 'I am Aditya';
// // SHA256 is a one way hashing algorithm
// // it means that given the same message, it always gives vack the same code
// // but we cannot retrieve the message from the code
// // thus can be used to save passwords in db
// const crypt = SHA256(user).toString();

// // console.log(user);
// // console.log(crypt);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// const resultHash =  SHA256(JSON.stringify(data)+'somesecret').toString();

// token.data = 5;
// token.hash = SHA256(JSON.stringify(data)).toString(); // if the token is modified at the clients end, he wont have access to the secret token added


// if(token.hash === resultHash) {
//     console.log(token);
//     console.log('TOken matched');
// } else {
//     console.log('token not matched');
//     console.log(token);
// }

// console.log(data);

// the above things can be implemented in a simpler way

const jwt = require('jsonwebtoken');

const data = {
    id: 4
};

const token = jwt.sign(data, 'abc123'); // this is the token we send back to the user, 'abc123' is the secret

const decoded = jwt.verify(token + '1', 'abc123'); // when the token is unaltered and the secret is correct only then will it pass

console.log('token', token);
console.log('decoded', decoded);


