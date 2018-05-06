'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({

    item_name: {
        type: String,
        required: [true, 'Item name is required']
    },
    item_price: {
        type: Number,
        required: [true, 'Price is required']
    },
    item_description: {
        type: String,
        required: [true, 'Description is required']
    },
    category_id: {
        require: [true, 'Category is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    category_type: {
        require: [true, 'Category type is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorytypes'
    },
    sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategories'
    },
    sub_sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subsubcategories'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var Item = mongoose.model('Items', ItemSchema);
module.exports = Item;