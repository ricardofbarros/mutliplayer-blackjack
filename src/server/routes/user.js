var express = require('express');
var router = express.Router();
var User = require('../models/User');
var config = require('../config');

// Route mount path: /api/user

// Create new user
router.post('/', function (req, res) {
  var payload = req.params;
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
    return res.boom.badData('Missing params.');
  }

  // Sane check
  if (payload.password !== payload.confirmPassword) {
    return res.boom.badData('Password doesn\'t match with Confirm Password');
  }

  return User.findOne({ username: req.params.username }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // If this user already exists
    // return an error
    if (user) {
      // TODO fire a cool http error status and msg
    }

    user = new User({
      username: req.params.username,
      password: req.params.password, // TODO hash password,
      accountBalance: config.user.startingMoney
    });

    return user.save(function (err) {
      if (err) {
        return res.boom.badRequest(err);
      }

      // TODO Return happy msg with session
    });
  });
});

module.exports = router;
