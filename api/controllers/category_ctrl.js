'use strict';

var util = require('util');
const mongoose = require('mongoose');
const async = require('async');
var categoryModel = require('../models/categories');
var subCategoriesModel = require('../models/subCategories');
var itemsModel = require('../models/item');

module.exports = {
    addCategory: addCategory,
    getCategory: getCategory,
    deleteCategory: deleteCategory
};

function deleteCategory(req, res) {

    if (!req.swagger.params._id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    }else{
        let ID = mongoose.Types.ObjectId(decodeURIComponent(req.swagger.params._id.value));
        itemsModel.find({
            category_id: ID,
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
                    subCategoriesModel.find({
                        category_id: ID,
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
                                categoryModel.findOneAndUpdate({_id: ID, deleted: false},{deleted:true},(err, data) => {
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
                                                data: data
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
                                    code: req.config.RESPONSE_CODES.BAD_REQUEST,
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

function getCategory(req, res) {
        var condition = {
            deleted: false
        }
        if(req.body._id){
            condition._id = mongoose.Types.ObjectId(req.body._id);
        }
        var aggregate = [
            {
                $graphLookup: {
                    from: "categorytypes",
                    startWith: "$category_type",
                    connectFromField: "category_type",
                    connectToField: "_id",
                    as: "category_type",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $graphLookup: {
                    from: "subcategories",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "category_id",
                    as: "sub_categories",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $match: condition
            }
        ]

        let countQuery = aggregate;

        if(req.body.page && req.body.limit){
            var limit = req.body.limit;
            var skip = limit*(req.body.page - 1);
            aggregate.push({
                $limit: parseInt(limit) + parseInt(skip)
            });
            aggregate.push({
                $skip: parseInt(skip)
            });
        }
        categoryModel.aggregate(aggregate,(err, data) => {
            if (err) {
                countQuery.push({
                    $count: "count"
                })
                categoryModel.aggregate(countQuery,(err,data)=>{
                    console.log('count of categories send when needed ---- > ',data);
                })
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
    if (!req.body.category_name || !req.body.category_type) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        if(req.body._id){
            categoryModel.findByIdAndUpdate({_id:req.body._id},req.body,{new:true},(err,data) =>{
                if(err){
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                }else if(data){
                    
                    addSubCategories(req.body.sub_categories,data._id,(err,subs)=>{
                        res.json({
                            code: req.config.RESPONSE_CODES.SUCCESS,
                            message: req.config.RESPONSE_MESSAGES.SUCCESS,
                            data:{
                                category: data,
                                sub_categories: subs
                            } 
                        });
                    })
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.NOT_FOUND,
                        message: req.config.RESPONSE_MESSAGES.NOT_FOUND,
                        data: data
                    });
                }
            })
        }else{
            var newCategory = new categoryModel();
            newCategory.category_name = req.body.category_name ? req.body.category_name.toLowerCase() : null;
            newCategory.category_type = req.body.category_type ? req.body.category_type : null;
            newCategory.save((err, item) => {
                if (err) {
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                } else {
                    addSubCategories(req.body.sub_categories,item._id,(err,data)=>{
                        res.json({
                            code: req.config.RESPONSE_CODES.SUCCESS,
                            message: req.config.RESPONSE_MESSAGES.SUCCESS,
                            data:{
                                category: item,
                                sub_categories: data
                            } 
                        });
                    })
                }
            })
        }        
    }
}

function addSubCategories(data, id, cb){
    if(data[0]){
        let subCats = [];
        async.each(data, function(subCat, callback) {

            let newCategory = new subCategoriesModel();

            if(subCat._id){
                subCategoriesModel.findByIdAndUpdate({_id:subCat._id},{subCategory_name: subCat.subCategory_name},{new:true},(err,data) =>{
                    if(err){
                        callback(err);
                    }else if(data){
                        callback();
                    }else{
                        callback();
                    }
                })
            }else{
                newCategory.category_id = id ? id : null;
                newCategory.subCategory_name = subCat.subCategory_name ? subCat.subCategory_name.toLowerCase() : null;
                newCategory.save((err, item) => {
                    if (err) {
                        callback(err);
                    } else {
                        subCats.push(item);
                        callback();
                    }
                })
            }
        }, function(err) {
            if( err ) {
                cb(null, subCats);
            } else {
                cb(null, subCats);
            }
        });
    }
}