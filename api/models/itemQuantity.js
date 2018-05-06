'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var quantity = new mongoose.Schema({

    item_id: {
        require: [true, 'Category type is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorytypes'
    },
    size_id: {
        require: [true, 'Category type is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorytypes'
    },
    quantity:{
        required:[true, 'Quantity for item is required'],
        type: Number,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var quantity = mongoose.model('quantities', quantity);
module.exports = quantity;