// Dependencies
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var config = require('../../config');
var util = require('../util');
var apiMsgState = config.apiMsgState;

// Route mount path: /api/user

// Create new user
router.post('/', function (req, res) {
  var payload = req.body;
  var paramsKeys = Object.keys(payload);
  var paramsRequired = [
    'username',
    'password',
    'confirmPassword'
  ];

  // Check if all params required
  // are in the payload
  // If not return an error
  var checkRequired = paramsRequired.every(function (param) {
    if (!payload[param]) {
      return false;
    }

    return (paramsKeys.indexOf(param) > -1);
  });
  if (!checkRequired) {
    return res.boom.badData(apiMsgState.MISSING_PARAMS);
  }

  // Sane check
  if (payload.password !== payload.confirmPassword) {
    return res.boom.badData(apiMsgState.PASSWORD_MATCH);
  }

  return User.findOne({ username: payload.username }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // If this user already exists
    // return an error
    if (user) {
      return res.boom.conflict(apiMsgState.USER_EXISTS);
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
        message: apiMsgState.CREATED_USER
      });
    });
  });
});

module.exports = router;
