'use strict';

const mongoose = require('mongoose');
var sizesModel = require('../models/sizes');

module.exports = {
    getSizes: getSizes,
    addSizes: addSizes
};

function addSizes(req,res){
    if(!req.body.size_name || !req.body.size_group){
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    }else{
        if(req.body._id){
            sizesModel.findByIdAndUpdate({_id:req.body._id},req.body,{new:true},(err,data) =>{
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
                            data:data 
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
            var size = new sizesModel();
            size.size_name = req.body.size_name;
            size.size_group = req.body.size_group;
            size.save((err,data)=>{
                if(err){
                    res.json({
                        code: req.config.RESPONSE_CODES.ERROR,
                        message: req.config.RESPONSE_MESSAGES.ERROR,
                        error: err
                    })
                }else{
                    res.json({
                        code: req.config.RESPONSE_CODES.SUCCESS,
                        message: req.config.RESPONSE_MESSAGES.SUCCESS,
                        data: data
                    })
                } 
            })
        }
        
    }
}

function getSizes(req,res){
    let condition = {deleted: false}
    if(req.body._id){
        condition._id = req.body._id
    }
    sizesModel.find(condition).exec((err,data)=>{
        if(err){
            res.json({
                code: req.config.RESPONSE_CODES.ERROR,
                message: req.config.RESPONSE_MESSAGES.ERROR,
                error: err
            })
        }else{
            if(data.length){
                res.json({
                    code: req.config.RESPONSE_CODES.SUCCESS,
                    message: req.config.RESPONSE_MESSAGES.SUCCESS,
                    data: data
                })
            }else{
                res.json({
                    code: req.config.RESPONSE_CODES.NO_CONTENT,
                    message: req.config.RESPONSE_MESSAGES.NO_CONTENT,
                    data: data
                });
            }
        }
    })
}
