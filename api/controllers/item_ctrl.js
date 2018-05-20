'use strict';

const util = require('util');
const itemsModel = require('../models/item');
const itemImagesModel = require('../models/item_images');
const itemQuantityModel = require('../models/itemQuantity');
const fs = require('file-system');
const async = require('async');
const mongoose = require('mongoose');

module.exports = {
    addItem: addItem,
    getAllItems: getAllItems,
    addImageToItem: addImageToItem,
    deleteItem: deleteItem,
    deleteItemImage: deleteItemImage
};

function deleteItemImage(req, res){
    try{
        console.log('itemId: ' , req.swagger.params.itemId.value);
        console.log('imageId: ' , req.swagger.params.imageId.value);
        condition={
            _id: mongoose.Types.ObjectId(req.swagger.params.imageId.value),
            item_id: mongoose.Types.ObjectId(req.swagger.params.imageId.value),
            deleted: false
        }
        itemImagesModel.findOneAndUpdate(condition,{deleted: true}, {new:true},(err,data)=>{
            if(err){
                res.json({
                    code: req.config.RESPONSE_CODES.ERROR,
                    message: req.config.RESPONSE_MESSAGES.ERROR,
                    error: e
                })
            }else{
                if(data){
                    res.json({
                        code: req.config.RESPONSE_CODES.SUCCESS,
                        message: req.config.RESPONSE_MESSAGES.SUCCESS,
                        data: data
                    })
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.NO_CONTENT,
                        message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                        data: 0
                    })
                }
            }
        })
        
    }catch(e){
        console.log('err in fileupload --->', e);
        res.json({
            code: req.config.RESPONSE_CODES.ERROR,
            message: req.config.RESPONSE_MESSAGES.ERROR,
            error: e
        })
    }
}


function deleteItem(req, res){
    if(!req.swagger.params.item_id){
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST,
            error: true
        })
    }else{
        try{
            let item_id  = mongoose.Types.ObjectId(req.swagger.params.item_id.value);
            let condition = {
                _id: item_id,
                deleted: false
            };
            itemsModel.findOneAndUpdate(condition,{deleted: true},(err,item)=>{
                if(err){
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                }else{
                    if(item){
                        itemImagesModel.update({item_id: item_id},{deleted:true},(err,data)=>{
                            if(err){
                                res.json({
                                    code: req.config.RESPONSE_CODES.SUCCESS,
                                    message: 'Item has been deleted successfully, but some images of item may not be deleted!',
                                    error: err
                                })
                            }else{
                                res.json({
                                    code: req.config.RESPONSE_CODES.SUCCESS,
                                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                    error: err
                                })
                            }
                        })
                    }else{
                        res.json({
                            code: req.config.RESPONSE_CODES.NO_CONTENT,
                            code: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                            error: true
                        })
                    }
                }
                
            })
        }catch(e){
            console.log('err in delete item---->', e);
            res.json({
                code: req.config.RESPONSE_CODES.ERROR,
                message: req.config.RESPONSE_MESSAGES.ERROR,
                error: e
            })
        }
    }
    
}

function addImageToItem(req, res){
    try{
        // console.log('files---->', req);
        let upFile = req.files.files[0]
        console.log('files--->', req.files);
        var path  = '/public/uploads/'+Date.now()+'_'+upFile.originalname;
        var filePath = '.'+path;
        fs.writeFile(filePath,upFile.buffer, (err) => {
            if (err) throw err;
            else{
                let images = new itemImagesModel();
                images.image_path = 'http://' +req.headers.host + path;
                images.item_id= mongoose.Types.ObjectId(req.swagger.params.itemId.value);
                images.is_thumbnail=req.swagger.params.isThumb.value;
                images.save((err,data)=>{
                    if(err){
                        console.log(err);
                        res.json({
                            code: req.config.RESPONSE_CODES.ERROR,
                            message: req.config.RESPONSE_MESSAGES.ERROR,
                            error: err
                        })
                    }else{
                        res.json({
                            code: req.config.RESPONSE_CODES.SUCCESS,
                            message: req.config.RESPONSE_MESSAGES.SUCCESS,
                            data: {path:'http://' + req.headers.host + path}
                        })
                    }
                })
            }
        });
    }catch(e){
        console.log('err in fileupload --->', e);
        res.json({
            code: req.config.RESPONSE_CODES.ERROR,
            message: req.config.RESPONSE_MESSAGES.ERROR,
            error: e
        })
    }
}

function addItem(req, res) {
    if (!req.body.item_name || !req.body.item_price || !req.body.item_description || !req.body.category_id || !req.body.category_type_id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        var newItem = new itemsModel();
        if(req.body._id){
            itemsModel.find({_id:req.body._id},(err,data) =>{
                if(err){
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                }else if(data){
                    newItem = data;
                    newItem.item_name = req.body.item_name ? req.body.item_name.toLowerCase() : newItem.item_name;
                    newItem.item_price = req.body.item_price ? req.body.item_price : newItem.item_price;
                    newItem.item_description = req.body.item_description ? req.body.item_description : newItem.item_description;
                    newItem.category_id = req.body.category_id ? req.body.category_id : newItem.category_id;
                    newItem.sub_category_id = req.body.sub_category_id ? req.body.sub_category_id : newItem;
                    newItem.sub_sub_category_id = req.body.sub_sub_category_id ? req.body.sub_sub_category_id : newItem.sub_sub_category_id;
                    newItem.category_type = req.body.category_type_id ? req.body.category_type_id : newItem.category_type_id;
                    itemsModel.update({_id: req.body._id, deleted: false}, newItem,{new: true}, (err,item)=>{
                        console.log('item------>', item);
                        item._id = req.body._id
                        if(err){
                            res.json({
                                code: req.config.RESPONSE_CODES.ERROR,
                                message: req.config.RESPONSE_MESSAGES.ERROR,
                                error: err
                            })
                        }else{
                            if(item){
                                addQuantityForItem(req, item, (err,data)=>{
                                    if(err){
                                        res.json({
                                            code: req.config.RESPONSE_CODES.SUCCESS,
                                            message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                            data: item
                                        });
                                    }else{
                                        if(data){
                                            res.json({
                                                code: req.config.RESPONSE_CODES.SUCCESS,
                                                message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                                data: item
                                            });
                                        }else{
                                            res.json({
                                                code: req.config.RESPONSE_CODES.SUCCESS,
                                                message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                                data: item
                                            });
                                        }
                                    }
                                })
                            }else{
                                res.json({
                                    code: req.config.RESPONSE_CODES.NO_CONTENT,
                                    message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                                })
                            }
                        }
                    })
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.NO_CONTENT,
                        message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                    })                    
                }
            })
        }else{
            newItem.item_name = req.body.item_name ? req.body.item_name.toLowerCase() : null;
            newItem.item_price = req.body.item_price ? req.body.item_price : null;
            newItem.item_description = req.body.item_description ? req.body.item_description : null;
            newItem.category_id = req.body.category_id ? req.body.category_id : null;
            newItem.sub_category_id = req.body.sub_category_id ? req.body.sub_category_id : null;
            newItem.sub_sub_category_id = req.body.sub_sub_category_id ? req.body.sub_sub_category_id : null;
            newItem.category_type = req.body.category_type_id ? req.body.category_type_id : null;
            newItem.save((err, item) => {
                if (err) {
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                } else {
                    if(item){
                        addQuantityForItem(req, item, (err,data)=>{
                            if(err){
                                res.json({
                                    code: req.config.RESPONSE_CODES.SUCCESS,
                                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                    data: item
                                });
                            }else{
                                if(data){
                                    item.quantity= data;
                                    res.json({
                                        code: req.config.RESPONSE_CODES.SUCCESS,
                                        message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                        data: item
                                    });
                                }else{
                                    res.json({
                                        code: req.config.RESPONSE_CODES.SUCCESS,
                                        message: req.config.RESPONSE_MESSAGES.SUCCESS,
                                        data: item
                                    });
                                }
                            }
                        })
                    }else{
                        res.json({
                            code: req.config.RESPONSE_CODES.NO_CONTENT,
                            message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                        })
                    } 
                }
            })
        }
        
    }
}

function getAllItems(req, res) {
    console.log('req body -- >', req.body );
    if (false) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
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
                    from: "categories",
                    startWith: "$category_id",
                    connectFromField: "category_id",
                    connectToField: "_id",
                    as: "category",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $graphLookup: {
                    from: "subcategories",
                    startWith: "$sub_category_id",
                    connectFromField: "sub_category_id",
                    connectToField: "_id",
                    as: "sub_category",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $graphLookup: {
                    from: "subsubcategories",
                    startWith: "$sub_sub_category_id",
                    connectFromField: "sub_sub_category_id",
                    connectToField: "_id",
                    as: "sub_sub_category",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $graphLookup: {
                    from: "itemimages",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "item_id",
                    as: "item_images",
                    restrictSearchWithMatch: { "deleted" : false }
                }
            },
            {
                $graphLookup: {
                    from: "quantities",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "item_id",
                    as: "quantity",
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

        itemsModel.aggregate(aggregate).exec((err,data)=>{
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
}

function addQuantityForItem(req , item , cb){
    if(req.body.quantity && Array.isArray(req.body.quantity) && req.body.quantity.length){
        let quantityArr = req.body.quantity;
        let quantities = [];
        async.each(quantityArr, function(q, callback) {
            if(q._id){
                itemQuantityModel.findOneAndUpdate({_id: q._id}, q, (err,data)=>{
                    // console.log('err---->',err);
                    // console.log('data---->',data);
                    callback();
                })
            }else{
                let quantity = new itemQuantityModel();
                quantity.item_id= item._id;
                quantity.size_id= q.size_id;
                quantity.quantity= q.quantity;
                quantity.save((err,data)=>{
                    // console.log('err---->',err);
                    // console.log('data---->',data);
                    quantities.push(data);
                    callback();
                })
            }
        }, function(err) {  
            if(err){
                cb(null,true); 
            }else{
                cb(null,quantities);  
            }
        });
    }else{
        cb(null,true);
    }
}