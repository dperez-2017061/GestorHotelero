'use strict'

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    name: String,
    description: String,
    services:[
        {
            service: {type: mongoose.Schema.ObjectId, ref:'Service'},
            price: Number
        }
    ],
    type: String,
    status: String,
    price: Number,
    hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'}
});

module.exports = mongoose.model('Room', roomSchema);