// Dependencies
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var config = require('../../config');
var util = require('../util');

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
    return (paramsKeys.indexOf(param) > -1);
  });
  if (!checkRequired) {
    return res.boom.badData('Missing params');
  }

  // Sane check
  if (payload.password !== payload.confirmPassword) {
    return res.boom.badData('Password doesn\'t match with Confirm Password');
  }

  return User.findOne({ username: payload.username }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // If this user already exists
    // return an error
    if (user) {
      return res.boom.conflict('This user already exists');
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

      return util.answerInterface.call({res: res}, 201, 'Created user with success');
    });
  });
});

module.exports = router;
