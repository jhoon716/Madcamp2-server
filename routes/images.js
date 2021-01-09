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
    app.get('/api/images/:filename', (req, res) => {
        const file = req.params.filename;
        // console.log(req.params.filename);
        Image.find({filename: req.params.filename}, {_id: 0, path: 1}, function (err, image) {
            if (err) return res.status(500).json({error: err});
            if (!image) return res.status(404).json({error: 'image not found'});
            const img = fs.readFileSync(__dirname + '/../uploads/' + file);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(img, 'binary');
            // res.json(image);
        })
    });

    app.delete('/api/images/:image_id', function(req, res) {
        Image.remove({ _id: req.params.image_id }, function(err, output) {
            if (err) return res.status(500).json({ err: 'database failure' });

            // TODO: delete image file in /uploads/
            res.status(204).end();
        })
    })
}
