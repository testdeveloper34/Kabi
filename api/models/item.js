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
        type: number,
        required: [true, 'Price is required']
    },
    item_description: {
        type: String,
        required: [true, 'Description is required']
    },
    category_id: {
        require: [true, 'Category is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;