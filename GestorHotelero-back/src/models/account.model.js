'use strict'

const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    days: [
        {lodging: Number},
        {
            services:[
                {service: {type: mongoose.Schema.ObjectId, ref:'Service'}},
                {price: Number}
            ]
        },
        {subTotal: Number}
    ],
    total: Number
});

module.exports = mongoose.model('Account', accountSchema);