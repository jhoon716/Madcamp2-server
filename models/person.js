const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    uuid: {type: String, unique: true},
    name: String,
    number: String,
    timestamp: Date
});

module.exports = mongoose.model('person', personSchema);
