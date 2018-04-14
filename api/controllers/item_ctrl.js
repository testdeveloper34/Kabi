'use strict';

var util = require('util');
var itemModel = require('../models/item');

module.exports = {
    addItem: addItem
};

function addItem(req, res) {
    if (!req.body.item_name || !req.body.item_price || !req.body.item_description || !req.body.category_id) {
        res.json({
            code: req.config.RESPONSE_CODES.BAD_REQUEST,
            message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
        })
    } else {
        var newItem = new itemModel();

        newItem.item_name = req.body.item_name.toLowerCase();
        newItem.item_price = req.body.item_price;
        newItem.item_description = req.body.item_description.toLowerCase();
        newItem.category_id = req.body.category_id;

        newItem.save((err, item) => {
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