'use strict';

var util = require('util');
var categoryModel = require('../models/categories');

module.exports = {
    addCategory: addCategory,
    getCategory: getCategory
};

function getCategory(req, res) {

        categoryModel.find({},(err, data) => {
            if (err) {
                res.json({
                    code: req.config.RESPONSE_CODES.ERROR,
                    message: req.config.RESPONSE_MESSAGES.ERROR,
                    error: err
                })
            } else {
                res.json({
                    code: req.config.RESPONSE_CODES.SUCCESS,
                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                    data: data
                });
            }
        })
}

function addCategory(req, res) {
    if (!req.body.category_name) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        var newCategory = new categoryModel();

        if(req.body._id){
            newCategory._id = req.body._id;
        }

        newCategory.category_name = req.body.category_name ? req.body.category_name.toLowerCase() : null;

        newCategory.save((err, item) => {
            if (err) {
                res.json({
                    code: req.config.RESPONSE_CODES.ERROR,
                    message: req.config.RESPONSE_MESSAGES.ERROR,
                    error: err
                })
            } else {
                res.json({
                    code: req.config.RESPONSE_CODES.SUCCESS,
                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                    data: item
                });
            }
        })
    }
}