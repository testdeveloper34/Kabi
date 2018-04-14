'use strict';

var util = require('util');
var userModel = require('../models/users');
var adminModel = require('../models/admin');

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  loginAdmin: loginAdmin
};

function registerUser(req, res) {
  if (!req.body.fullname || !req.body.user_name || !req.body.email || !req.body.password || !req.body.mobile_primary || !req.body.role_id) {
    res.json({
      code: req.config.RESPONSE_CODES.BAD_REQUEST,
      message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
    })
  } else {
    var user = new userModel();
    user.full_name = req.body.fullname.toLowerCase();
    user.user_name = req.body.user_name.toLowerCase();
    user.email = req.body.email.toLowerCase();
    user.password = req.body.password;
    user.mobile_primary = req.body.mobile_primary;
    user.role_id = req.body.role_id;
    user.calling_code = req.body.calling_code || null;
    user.mobile_secondry = req.body.mobile_secondry || null;

    user.save((err, user) => {
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
          data: user
        });
      }
    })
  }
}

function loginUser(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({
      code: req.config.RESPONSE_CODES.BAD_REQUEST,
      message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
    })
  } else {
    var userObj = {
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }

    userModel.findOne(userObj, (err, user) => {
      if (err) {
        res.json({
          code: req.config.RESPONSE_CODES.ERROR,//
          message: req.config.RESPONSE_MESSAGES.ERROR,
          error: err
        })
      } else {
        if (user) {
          res.json({
            code: req.config.RESPONSE_CODES.SUCCESS,
            message: req.config.RESPONSE_MESSAGES.SUCCESS,
            data: user
          });
        } else {
          res.json({
            code: req.config.RESPONSE_CODES.WRONG_CREDENTIALS,
            message: req.config.RESPONSE_MESSAGES.WRONG_CREDENTIALS,
            data: user
          });
        }
      }
    })
  }
}

function loginAdmin(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({
      code: req.config.RESPONSE_CODES.BAD_REQUEST,
      message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
    })
  } else {
    var userObj = {
      email: req.body.email.toLowerCase(),
      password: req.body.password
    }

    adminModel.findOne(userObj, (err, user) => {
      if (err) {
        res.json({
          code: req.config.RESPONSE_CODES.ERROR,//
          message: req.config.RESPONSE_MESSAGES.ERROR,
          error: err
        })
      } else {
        if (user) {
          res.json({
            code: req.config.RESPONSE_CODES.SUCCESS,
            message: req.config.RESPONSE_MESSAGES.SUCCESS,
            data: user
          });
        } else {
          res.json({
            code: req.config.RESPONSE_CODES.WRONG_CREDENTIALS,
            message: req.config.RESPONSE_MESSAGES.WRONG_CREDENTIALS,
            data: user
          });
        }
      }
    })
  }
}


