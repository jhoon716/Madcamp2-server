const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: String,
    number: String,
});

module.exports = mongoose.model('person', personSchema);
