'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var subSubCategorySchema = new mongoose.Schema({

    name: {
        type: String,
    },
    sub_category_id: {
        require: [true, 'Sub Category is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategories'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var subSubCategory = mongoose.model('SubSubCategories', subSubCategorySchema);
module.exports = subSubCategory;