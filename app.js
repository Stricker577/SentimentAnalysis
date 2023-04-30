//configure requirements
const express = require('express');
const controller = require('./controller');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//start running the website
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});

app.use('/', controller);