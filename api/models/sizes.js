'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var schema = mongoose.Schema;

var sizeSchema = new mongoose.Schema({

    size_name: {
        type: String,
    },
    size_group: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var size = mongoose.model('sizes', sizeSchema);
module.exports = size;