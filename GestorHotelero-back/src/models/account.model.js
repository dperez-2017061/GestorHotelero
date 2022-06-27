'use strict'

const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    days: [
        {
            lodging: Number,
            events:[
                {
                    event: {type: mongoose.Schema.ObjectId, ref:'Event'},
                    price: Number
                }
            ],
            services:[
                {
                    service: String,
                    price: Number
                }
            ],
            subTotal: Number
        }
    ],
    total: Number
});

module.exports = mongoose.model('Account', accountSchema);