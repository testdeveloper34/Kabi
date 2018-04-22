'use strict';

var util = require('util');
var subCategoriesModel = require('../models/subCategories');

module.exports = {
    addSubCategory: addSubCategory,
    getSubCategory: getSubCategory
};

function getSubCategory(req, res) {

    var condition = {};
    if(req.body.category_id){
        condition['category_id'] = req.body.category_id
    }

        subCategoriesModel.find(condition,(err, data) => {
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

function addSubCategory(req, res) {
    if (!req.body.subCategory_name || !req.body.category_id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        var newCategory = new subCategoriesModel();

        if(req.body._id){
            newCategory._id = req.body._id;
        }

        newCategory.category_id = req.body.category_id ? req.body.category_id : null;
        newCategory.subCategory_name = req.body.subCategory_name ? req.body.subCategory_name.toLowerCase() : null;

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