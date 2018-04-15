'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({

    full_name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [50, 'First name length should be less than or equal to 50 character']
    },
    user_name: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
        maxlength: [50, 'Username length should be less than or equal to 50 character']
    },
    email: {
        type: String,
        required: [true, 'Email name is required'],
        unique: [true, 'Email already exists'],
        maxlength: [50, 'Email length should be less than or equal to 50 character']
    },
    password: {
        type: String,
        require: [true, 'Password is required']
    },
    calling_code:{
        type: String,
        maxlength: [6, 'Calling code length cannot be more than 6 digits']
    },
    mobile_primary:{
        type: String,
        required: [true, 'Primary mobile no. is required'],
        maxlength: [12, 'Mobile no. length should be less than or equal to 12 character']
    },
    mobile_secondry:{
        type: String,
        maxlength: [12, 'Mobile no. length should be less than or equal to 12 character']
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Role is required'],
    },
    profile_image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Deactive'],
        default: 'Deactive'
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    is_login: {
        type: Boolean,
        default: false
    },
    login_token: {
        type: Boolean,
        default: false
    },
    is_admin: {
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

var User = mongoose.model('User', UserSchema);
module.exports = User;