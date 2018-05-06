'use strict';

var util = require('util');
var mongoose = require('mongoose');
var subCategoriesModel = require('../models/subCategories');
var subSubCategoriesModel = require('../models/subSubCategories');
var itemsModel = require('../models/item');

module.exports = {
    addSubCategory: addSubCategory,
    getSubCategory: getSubCategory,
    deleteSubCategory: deleteSubCategory
};

function deleteSubCategory(req, res) {
    if (!req.swagger.params._id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    }else{
        let ID = mongoose.Types.ObjectId(decodeURIComponent(req.swagger.params._id.value));
        itemsModel.find({
            sub_category_id: ID,
            deleted: false
        }).exec((err,data)=>{
            if(err){
                res.json({
                    code: req.config.RESPONSE_CODES.ERROR,
                    message: req.config.RESPONSE_MESSAGES.ERROR,
                    error: err
                })
            }if(data){
                if(!data.length){
                    subSubCategoriesModel.find({
                        sub_category_id: ID,
                        deleted: false
                    }).exec((err,data)=>{
                        if(err){
                            res.json({
                                code: req.config.RESPONSE_CODES.ERROR,
                                message: req.config.RESPONSE_MESSAGES.ERROR,
                                error: err
                            })
                        }
                        if(data){
                            if(!data.length){
                                subCategoriesModel.findOneAndUpdate({deleted:false, _id: ID},{deleted:true},(err, data) => {
                                    if (err) {
                                        res.json({
                                            code: req.config.RESPONSE_CODES.ERROR,
                                            message: req.config.RESPONSE_MESSAGES.ERROR,
                                            error: err
                                        })
                                    } else {
                                        if(data){
                                            res.json({
                                                code: req.config.RESPONSE_CODES.SUCCESS,
                                                message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                                data: true
                                            });
                                        }else{
                                            res.json({
                                                code: req.config.RESPONSE_CODES.NO_CONTENT,
                                                message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                                                data: data
                                            });
                                        }
                                    }
                                })
                            }else{
                                res.json({
                                    code: req.config.RESPONSE_CODES.ERROR,
                                    message: req.config.RESPONSE_MESSAGES.CHILD_EXIST,
                                    error: err
                                })
                            }
                        }
                    })
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.BAD_REQUEST,
                        message: req.config.RESPONSE_MESSAGES.ITEM_EXIST
                    })
                }
            }
        })
    }
}

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
            subCategoriesModel.findByIdAndUpdate({_id:subCat._id},{subCategory_name: subCat.subCategory_name},{new:true},(err,data) =>{
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
                        data: item
                    });
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.NOT_FOUND,
                        message: req.config.RESPONSE_MESSAGES.NOT_FOUND,
                        data: item
                    });
                }
            })
        }else{
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
}
