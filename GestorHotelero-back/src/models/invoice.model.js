'use strict'

const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
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
                    service: {type: mongoose.Schema.ObjectId, ref:'Service'},
                    price: Number
                }
            ],
            subTotal: Number
    }
    ],
    total: Number
});

module.exports = mongoose.model('Invoice', invoiceSchema);