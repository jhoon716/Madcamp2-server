const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

module.exports = function(app, Image)
{
    // Image upload
    const form = "<!DOCTYPE HTML><html><body>" +
    "<form method='post' action='/api/images' enctype='multipart/form-data'>" +
    "<input type='file' name='image'/>" +
    "<input type='submit' /></form>" +
    "</body></html>";

    app.get('/upload', (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(form);
    });

    // Get all filenames from database
    app.get('/api/images/:fid', (req, res) => {
        Image.find({fid: req.params.fid}, {_id: 0, filename: 1}, (err, images) => {
            if (err) return res.status(500).send({error: 'database failure'});
            res.json(images);
        })
    });

    const storage = multer.diskStorage({
        destination: './uploads/',
        filename: function(req, file, cb) {
            return cb(null, file.originalname);
        // filename: function(req, file, cb) {
            // return crypto.pseudoRandomBytes(16, function(err, raw) {
            // if (err) {
            //         return cb(err);
            //     }
            //     return cb(null, "" + (raw.toString('hex')) + path.extname(file.originalname));
            // });
        }
    });
    
    app.post('/api/images', multer({storage: storage}).single('image'), (req, res) => {
        console.log(req.file);
        console.log(req.body);
        const image = new Image();
        image.filename = req.file.originalname;
        image.path = req.file.path;
        image.fid = req.body.fid;
        image.save(function(err) {
            if (err) {
                console.err(err);
                res.json(err);
                return;
            }
            res.redirect('/api/images/' + req.file.filename);
            console.log(req.file.filename);
            return res.status(200).end();
        })
    });
    
    // Get image by filename
    app.get('/api/images/:fid/:filename', (req, res) => {
        Image.findOne({fid: req.params.fid, filename: req.params.filename}, function (err, image) {
            if (err) return res.status(500).json({error: err});
            if (!image) return res.status(404).json({error: 'image not found'});
            const img = fs.readFileSync(__dirname + '/../uploads/' + image.filename);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(img, 'binary');
            // res.json(image);
        })
    });

    app.delete('/api/images/:fid/:filename', function(req, res) {
        Image.remove({fid: req.params.fid, filename: req.params.filename}, function(err, output) {
            if (err) return res.status(500).json({ err: 'database failure' });

            fs.unlink(__dirname + '/../uploads/' + req.params.filename, (err) => {
                if (err) return res.status(500).json({ err: 'database failure2' });
                res.status(204).end();
            })
        })
    })
}
