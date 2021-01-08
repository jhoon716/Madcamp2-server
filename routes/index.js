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
    app.get('/api/persons/:person_id', function(req, res) {
        Person.findOne({_id : req.params.person_id}, function(err, person) {
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

    // Create a person
    app.post('/api/persons', function(req, res) {
        const person = new Person();
        person.name = req.body.name;
        person.number = req.body.number;

        person.save(function(err) {
            if (err) {
                console.err(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});
        })
    });

    // Update a person
    app.put('/api/persons/:person_id', function(req, res) {
        Person.findById(req.params.person_id, function(err, person) {
            if (err) return res.status(500).json({ error: 'database failure' });
            if (!person) return res.status(404).json({ error: 'person not found' });

            if (req.body.name) person.name = req.body.name;
            if (req.body.number) person.number = req.body.number;

            person.save(function(err) {
                if (err) res.status(500).json({ error: 'failed to update' });
                res.json({message: 'person updated'});
            });
        });
    });

    //Delete a person
    app.delete('/api/persons/:person_id', function(req, res) {
        Person.remove({ _id: req.params.person_id }, function(err, output) {
            if (err) return res.status(500).json({ err: 'database failure' });

            // if (!output.result.n) return res.status(404).json({ error: 'person not found' });
            // res.json({ mesage: 'person deleted' });

            res.status(204).end();
        });
    });

}