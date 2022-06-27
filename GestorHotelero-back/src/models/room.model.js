'use strict'

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    NoRoom: String,
    description: String,
    services:[
        {
            service: String
        }
    ],
    type: String,
    status: String,
    price: Number,
    hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'}
});

module.exports = mongoose.model('Room', roomSchema);