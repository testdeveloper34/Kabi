'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var AddressSchema = new mongoose.Schema({

    address: {
        type: String,
        required: [true, 'address is required'],
        maxlength: [50, 'Lenght of address should be less than or equal to 50 character']
    },
    landmark: {
        type: String,
        maxlength: [50, 'Length of landmark should be less than or equal to 50 character']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    zip:{
        type: String,
        required: [true, 'Zip code is required'],
        maxlength: [8, 'Zip code length cannot be more than 6 digits']
    },
    country:{
        type: String,
        required: [true, 'Country is required'],
    },
    isdefault:{
        type: Boolean,
        default:false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Address = mongoose.model('UserAddress', AddressSchema);
module.exports = Address;