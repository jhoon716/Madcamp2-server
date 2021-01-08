const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    path: String
});

module.exports = mongoose.model('image', imageSchema);
