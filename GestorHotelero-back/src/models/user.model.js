'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    phone: String,
    email: String,
    role: String,
    hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'},
    visitedHotels: [
        {
            hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'}
        }
    ],
    events:[ 
        {
            event: {type: mongoose.Schema.ObjectId, ref:'Event'}
        }
    ],
    reservations:[
        {
            reservation: {type: mongoose.Schema.ObjectId, ref:'Reservation'}
        }
    ]
});

module.exports = mongoose.model('User', userSchema)