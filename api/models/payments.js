'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var PaymentsSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: [true, 'User Id is required']
    },
    payment_data: {
        require: [true, 'Payment data is required'],
        type: object
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Payments = mongoose.model('Payments', PaymentsSchema);
module.exports = Payments;