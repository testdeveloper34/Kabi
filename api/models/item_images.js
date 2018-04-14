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
        ref: 'Item'
    }
}, {
    timestamps: true
});

var ItemImage = mongoose.model('ItemImage', ItemImagesSchema);
module.exports = ItemImage;