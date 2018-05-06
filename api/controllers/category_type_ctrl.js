'use strict';

var util = require('util');
var categoryTypesModel = require('../models/category_types');

module.exports = {
    addCategoryType: addCategoryType,
    getCategoryTypes: getCategoryTypes
};

function getCategoryTypes(req, res) {
        var condition = {
            deleted: false
        }
        categoryTypesModel.find(condition,(err, data) => {
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

function addCategoryType(req, res) {
    if (!req.body.category_type_name) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        if(req.body._id){
            categoryTypesModel.findByIdAndUpdate({_id:req.body._id},req.body,{new:true},(err,data) =>{
                if(err){
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                }else if(data){
                    res.json({
                        code: req.config.RESPONSE_CODES.SUCCESS,
                        message: req.config.RESPONSE_MESSAGES.SUCCESS,
                        data: data
                    });
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.NOT_FOUND,
                        message: req.config.RESPONSE_MESSAGES.NOT_FOUND,
                        data: data
                    });
                }
            })
        }else{
            var newCategory = new categoryTypesModel();
            newCategory.category_type_name = req.body.category_type_name ? req.body.category_type_name.toLowerCase() : null;
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
}