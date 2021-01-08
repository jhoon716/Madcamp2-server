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

mongoose.connect('mongodb://localhost/mongodb_tutorial')

const Person = require('./models/person')

const router = require('./routes')(app, Person);

// Image upload
const form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='upload'/>" +
"<input type='submit' /></form>" +
"</body></html>";

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(form);
});

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + path.extname(file.originalname));
        });
    }
});

app.post('/upload', multer({storage: storage}).single('upload'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.redirect('/uploads/' + req.file.filename);
    console.log(req.file.filename);
    return res.status(200).end();
});

app.get('/uploads/:upload', (req, res) => {
    file = req.params.upload;
    console.log(req.params.upload);
    const img = fs.readFileSync(__dirname + '/uploads/' + file);
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(img, 'binary');
});

app.get('/home', (req, res) => {
    res.send('Hello DreamDP\n');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});