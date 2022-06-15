'use strict'

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    date: Date,
    roomType: String,
    advance: Number,
    status: String,
    hotel: {type: mongoose.Schema.ObjectId, ref:'Hotel'}
});

module.exports = mongoose.model('Reservation', reservationSchema);