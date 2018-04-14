'use strict';

var util = require('util');
var userModel = require('../models/users');

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser
};

function registerUser(req, res) {
  if(!req.body.fullname || !req.body.user_name || !req.body.email || !req.body.password || !req.body.mobile_primary|| !req.body.role_id){
    res.json({
      code:req.config.RESPONSE_CODES.BAD_REQUEST,
      message: req.config.RESPONSE_MESSAGES.BAD_REQUEST
    })
  }
  var user = new userModel();
  user.full_name = req.body.fullname.toLowerCase();
  user.user_name = req.body.user_name.toLowerCase();
  user.email = req.body.email.toLowerCase();
  user.password = req.body.password.toLowerCase();
  user.mobile_primary = req.body.mobile_primary;
  user.role_id = req.body.role_id;
  user.calling_code = req.body.calling_code || null;
  user.mobile_secondry = req.body.mobile_secondry || null;
  
  user.save((err,user)=>{
    if(err){
      res.json({
      code:req.config.RESPONSE_CODES.ERROR,
      message: req.config.RESPONSE_MESSAGES.ERROR,
      error:err
    })
    }else{
      res.json({
        code: req.config.RESPONSE_CODES.SUCCESS,
        message: req.config.RESPONSE_MESSAGES.SUCCESS,
        data: req.body
      });
    }
  })
}//

function loginUser(req, res) {
  console.log(req.body);
  res.json({
    code:200,
    message: 'successfull!',
    data: req.body
  });
}
