'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var CategorySchema = new mongoose.Schema({

    category_name: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Category = mongoose.model('Categories', CategorySchema);
module.exports = Category;