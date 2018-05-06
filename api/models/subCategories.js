'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var subCategorySchema = new mongoose.Schema({

    subCategory_name: {
        type: String,
    },
    category_id: {
        require: [true, 'Category is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var subCategory = mongoose.model('subcategories', subCategorySchema);
module.exports = subCategory;