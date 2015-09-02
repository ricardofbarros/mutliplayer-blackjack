// Dependencies
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var config = require('../../config');
var util = require('../util');
var userValidation = require('../../common/validation').user;

// Constants
var USER_EXISTS = config.apiMsgState.user.USER_EXISTS;
var CREATED_USER = config.apiMsgState.user.CREATED_USER;

// Route mount path: /api/user

// Create new user
router.post('/', function (req, res) {
  var payload = req.body;

  // Run common validation
  var valid = userValidation(config.apiMsgState, payload);
  if (!valid) {
    return res.boom.badData(valid);
  }

  return User.findOne({ username: payload.username }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // If this user already exists
    // return an error
    if (user) {
      return res.boom.conflict(USER_EXISTS);
    }

    user = new User({
      username: payload.username,
      password: util.hashPassword(payload.password),
      accountBalance: config.user.startingMoney
    });

    return user.save(function (err) {
      if (err) {
        return res.boom.badRequest(err);
      }

      return res.status(201).json({
        message: CREATED_USER
      });
    });
  });
});

module.exports = router;
