'use strict';

var util = require('util');
var userModel = require('../models/users').User;

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser
};

function registerUser(req, res) {
  console.log(req.body);
  res.json({
    code:200,
    message: 'successfull!',
    data: req.body
  });
}//

function loginUser(req, res) {
  console.log(req.body);
  res.json({
    code:200,
    message: 'successfull!',
    data: req.body
  });
}
