module.exports = function(app, Person)
{
    // Get all persons from Contacts
    app.get('/api/persons', function(req, res) {
        Person.find(function(err, persons) {
            if (err) return res.status(500).send({error: 'database failure'});
            res.json(persons);
        })
    });

    // Get a single person
    app.get('/api/persons/:uuid', function(req, res) {
        Person.findOne({uuid : req.params.uuid}, function(err, person) {
            if (err) return res.status(500).json({error: err});
            if (!person) return res.status(404).json({error: 'person not found'});
            res.json(person);
        })
    });
    
    // Get person by name
    app.get('/api/persons/name/:name', function(req, res) {
        Person.find({name: req.params.name}, {_id: 0, number: 1}, function(err, persons) {
            if (err) return res.status(500).json({error: err});
            if (persons.length === 0) return res.status(404).json({error: 'person not found'});
            res.json(persons);
        })
    });
    
    // Get persons updated after given time
    app.get('/api/persons/newer/:time', function(req, res) {
        Person.find({timestamp: {$gte: new Date(req.params.time)}}, function(err, persons) {
            res.json(persons);
        });
    })
    
    // Create a person
    app.post('/api/persons', function(req, res) {
        const person = new Person();
        person.uuid = req.body.uuid;
        person.name = req.body.name;
        person.number = req.body.number;
        person.timestamp = new Date();

        person.save(function(err) {
            if (err) {
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        })
    });

    // Create many people
    // TODO: Mark timestamps on each document(person)
    app.post('/api/persons/many', function(req, res) {
        const persons = req.body;
        Person.insertMany(persons, function(err, result) {
            if (err) return res.status(500).json({error: err});
            res.json(result);
        })
    });

    // Update a person
    app.put('/api/persons/:uuid', function(req, res) {
        Person.findOne({uuid: req.params.uuid}, function(err, person) {
            if (err) return res.status(500).json({ error: 'database failure' });
            if (!person) return res.status(404).json({ error: 'person not found' });

            if (req.body.name) person.name = req.body.name;
            if (req.body.number) person.number = req.body.number;
            person.timestamp = new Date(now);

            person.save(function(err) {
                if (err) res.status(500).json({ error: 'failed to update' });
                res.json({message: 'person updated'});
            });
        });
    });

    // Delete a person
    app.delete('/api/persons/:uuid', function(req, res) {
        Person.remove({ uuid: req.params.uuid }, function(err, output) {
            if (err) return res.status(500).json({ err: 'database failure' });

            // if (!output.result.n) return res.status(404).json({ error: 'person not found' });
            // res.json({ mesage: 'person deleted' });

            res.status(204).end();
        });
    });

}