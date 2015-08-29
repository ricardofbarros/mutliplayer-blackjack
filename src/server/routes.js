var express = require('express');
var router = express.Router();
var Session = require('./models/Session');
var User = require('./models/User');
var config = require('../config');

router.post('/user', function (req, res) {
  var paramsKeys = Object.keys(req.params);
  var paramsRequired = [
    'username',
    'password',
    'confirmPassword'
  ];

  // Check if all params required
  // are in the payload
  var checkRequired = paramsRequired.every(function (param) {
    return (paramsKeys.indexOf(param) > -1);
  });

  // If not return an error
  if (!checkRequired) {

  }

  // Sane check
  if (req.params.password !== req.params.confirmPassword) {

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

      // TODO Return happy msg
    });
  });
});

router.get('/user/me', function (req, res) {
  if (!req.query || !req.query.accessToken) {
    return res.boom.unauthorized('Missing access token.');
  }

  return Session.findOne({ accessToken: req.query.accessToken }, function (err, session) {
    if (err) {
      return res.boom.badRequest(err);
    }

    if (!session) {
      return res.boom.unauthorized('Invalid access token.');
    }

    return User.findById(session.userId, function (err, user) {
      if (err || !user) {
        return res.boom.badRequest(err || 'Something went wrong.');
      }

      return res.json(user);
    });
  });
});

router.put('/session', function (req, res) {

});

router.put('/session/play', function (req, res) {

});

module.exports = router;
