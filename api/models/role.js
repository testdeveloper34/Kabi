'use strict';

var mongoose = require('mongoose'),
    constantsObj = require('./../../constants');
var Schema = mongoose.Schema;

var RoleSchema = new mongoose.Schema({

    role_name: {
        type: String,
        required: [true, 'Role name is required'],
        maxlength: [50, 'Role name length should be less than or equal to 50 character']
    },
    role_category: {
        type: String,
        maxlength: [50, 'Role category length should be less than or equal to 50 character']
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Role = mongoose.model('Role', RoleSchema);
module.exports = Role;