const env = process.env.NODE_ENV || 'development';


// runs only when config.json file is present (security)
if (env === 'development' || env === 'test') {

    // when we require a json it automatically gets converted to plain js object
    const config = require('./config.json');
    const envConfig = config[env];
    Object.keys(envConfig).forEach((key)=> {
        process.env[key] = envConfig[key];
    });

}

// run the code below if you dont have the config.json file instead of the above one
// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI ='mongodb://localhost:27017/ToDoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI ='mongodb://localhost:27017/ToDoAppTest';
// }