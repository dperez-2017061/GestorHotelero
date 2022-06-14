'use strict'

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: String,
    schedule: String,
    cost: Number,
    extras: [
        {service: {type: mongoose.Schema.ObjectId, ref:'Service'}},
        {price: Number}
    ],
    type: String,
    hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'}
});

module.exports = mongoose.model('Event', eventSchema);