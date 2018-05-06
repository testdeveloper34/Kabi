'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var CategorySchema = new mongoose.Schema({

    category_name: {
        type: String,
    },
    category_type: {
        require: [true, 'Category type is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorytypes'
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