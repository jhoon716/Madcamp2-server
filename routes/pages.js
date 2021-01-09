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
    app.get('/api/pages/average', function(req, res) {
        // TODO: get average
        Page.aggregate([{$group: {_id: null, avg: {$avg:"$rating"}}}], (err, avg) => {
            if (err) return res.status(500).json({error: err});
            res.send(avg);
        });
    });

    // Get a page by date
    app.get('/api/pages/:date', function(req, res) {
        const date = new Date(req.params.date)
        console.log(date);
        Page.findOne({date: date}, function(err, page) {
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

        page.save(function(err) {
            if (err) {
                console.err(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        })
    });

    // Update a page
    app.put('/api/pages/:date', function(req, res) {
        Page.find(req.param.date, function(err, page) {
            if (err) return res.status(500).json({error: 'database failure'});
            if (!page) return res.status(4040).json({error: 'page not found'});

            if (req.body.weather) page.weather = req.body.weather;
            if (req.body.comment) page.comment = req.body.comment;
            if (req.body.rating) page.raing = req.body.rating;

            page.save(function(err) {
                if (err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'page updated'});
            });
        });
    });

    // Delete a page
    app.delete('/api/pages/:date', function(req, res) {
        Page.remove({date: req.params.date}, function(err, output) {
            if (err) return res.status(500).json({err: 'database failure'});

            res.status(204).end;
        });
    });
}