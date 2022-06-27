'use strict'

const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'},
    days: [
        {
            room: {type: mongoose.Schema.ObjectId, ref:'Room'},
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

module.exports = mongoose.model('Invoice', invoiceSchema);