'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var ItemImagesSchema = new mongoose.Schema({

    image_path: {
        type: String,
        required: [true, 'Image is required']
    },
    item_id: {
        require: [true, 'Item is required'],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items'
    },
    is_thumbnail: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var ItemImage = mongoose.model('ItemImage', ItemImagesSchema);
module.exports = ItemImage;