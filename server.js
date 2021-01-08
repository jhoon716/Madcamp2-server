const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');

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

mongoose.connect('mongodb://localhost/mongodb_tutorial')

const Person = require('./models/person')

const router = require('./routes')(app, Person);

app.get('/', (req, res) => {
    res.send('Hello Express\n');
});

app.get('/welcome', (req, res) => {
    res.send('Welcome to Express\n');
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});