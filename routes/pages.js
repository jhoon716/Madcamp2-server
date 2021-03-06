module.exports = function(app, Page)
{
    // Get all pages Diary
    app.get('/api/pages', function(req, res) {
        Page.find(function(err, pages) {
            if (err) return res.status(500).send({error: 'database failure'});
            res.json(pages);
        })
    });
    
    // Get average rating
    app.get('/api/pages/average/:fid', function(req, res) {
        Page.aggregate([{$group: {_id: "$fid", avg: {$avg:"$rating"}}}], (err, avg) => {
            if (err) return res.status(500).json({error: err});
            // TODO: Fix. Only workw when one profile is registered.
            res.send(String(avg[0].avg));
            // res.send(avg);
        });
    });

    // Get a page by date
    app.get('/api/pages/:fid/:date', function(req, res) {
        const date = new Date(req.params.date)
        Page.findOne({date: date, fid: req.params.fid}, function(err, page) {
            if (err) return res.status(500).json({error: err});
            if (!page) return res.status(404).json({error: 'page not found'});
            res.json(page);
        })
    });

    // Create a page
    app.post('/api/pages', function(req, res) {
        const page = new Page();
        page.date = req.body.date;
        page.weather = req.body.weather;
        page.comment = req.body.comment;
        page.rating = req.body.rating;
        page.fid = req.body.fid;

        page.save(function(err) {
            if (err) {
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        })
    });

    // Update a page
    app.put('/api/pages/:fid/:date', function(req, res) {
        console.log(req.body);
        Page.updateOne({date: req.params.date, fid: req.params.fid},
            {$set:{weather: req.body.weather, comment: req.body.comment, rating: req.body.rating}},
            function(err, page) {
            if (err) return res.status(500).json({error: 'database failure'});
            if (!page) return res.status(404).json({error: 'page not found'});
        });
    });

    // Delete a page
    app.delete('/api/pages/:fid/:date', function(req, res) {
        Page.remove({date: req.params.date, fid: req.params.fid}, function(err, output) {
            if (err) return res.status(500).json({err: 'database failure'});

            res.status(204).end;
        });
    });
}