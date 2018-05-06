'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var CategorytypesSchema = new mongoose.Schema({

    category_type_name: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Categorytypes = mongoose.model('Categorytypes', CategorytypesSchema);
module.exports = Categorytypes;