'use strict'

const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Service', serviceSchema);