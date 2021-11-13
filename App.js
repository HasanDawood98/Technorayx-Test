require('dotenv').config();
const http = require('http');
const express = require('express');
const db = require('./DB/Connection');
const bodyParser = require('body-parser');
const { join } = require('path');

const app = express();

const server = http.createServer(app);
//Route Files
let user = require('./routes/User');
let admin = require('./routes/Admin');
app.use(bodyParser.json());

app.use('/public', express.static(join(__dirname, 'public/')));

app.use('/', express.static(join(__dirname, 'static/')));

app.use('/user', user);
app.use('/admin', admin);
const port = 3000;

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
