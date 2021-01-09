const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    uuid: {type: String, index: true},
    name: String,
    number: String,
    timestamp: Date
});

module.exports = mongoose.model('person', personSchema);
