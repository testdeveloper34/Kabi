'use strict';

var util = require('util');
var subSubcategoryModel = require('../models/subSubCategories');
var itemsModel = require('../models/item');

module.exports = {
    addSubSubCategory: addSubSubCategory,
    getSubSubCategory: getSubSubCategory,
    deleteSubSubCategory: deleteSubSubCategory
};

function deleteSubSubCategory(req, res) {

    if (!req.body._id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    }else{
        let ID = req.body._id
        itemsModel.find({
            sub_sub_category_id: ID
        }).exec((err,data)=>{
            if(err){
                res.json({
                    code: req.config.RESPONSE_CODES.ERROR,
                    message: req.config.RESPONSE_MESSAGES.ERROR,
                    error: err
                })
            }if(data){
                if(!data.length){
                    subSubcategoryModel.findByIdAndUpdate({_id: ID},{deleted:true},(err, data) => {
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
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.BAD_REQUEST,
                        message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
                    })
                }
            }
        })
    }
}

function getSubSubCategory(req, res) {

    var condition = {};
    if(req.body.sub_category_id){
        condition['sub_category_id'] = req.body.sub_category_id
    }

        subSubcategoryModel.find(condition,(err, data) => {
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

function addSubSubCategory(req, res) {
     if (!req.body.category_name || !req.body.sub_category_id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        var newCategory = new subSubcategoryModel();

        if(req.body._id){
            newCategory._id = req.body._id;
        }

        newCategory.sub_category_id = req.body.sub_category_id ? req.body.sub_category_id : null;
        newCategory.name = req.body.name ? req.body.name.toLowerCase() : null;

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