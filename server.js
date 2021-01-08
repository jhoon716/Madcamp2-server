const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const multer        = require('multer');
const path          = require('path');
const crypto        = require('crypto');
const fs            = require('fs');

const hostname = '0.0.0.0'
const port = 1234;

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    // Connected to MongoDB server
    console.log("Conntected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');

const Person = require('./models/person');
const Image = require('./models/image');
const Page = require('./models/page');

const personsRouter = require('./routes/persons')(app, Person);
const imageRouter = require('./routes/images')(app, Image);
const diaryRouter = require('./routes/pages')(app, Page);

app.get('/home', (req, res) => {
    res.send('Hello DreamDP\n');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});