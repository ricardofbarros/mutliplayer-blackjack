var express = require('express');
var util = require('../util');
var User = require('../models/User');
var router = express.Router();

// Route mount path: /api/session

// Sign in
router.put('/', function (req, res) {

});

// Get info about himself
router.get('/user', util.isAuthenticated, function (req, res) {
  return User.findById(req.params.userId, function (err, user) {
    if (err || !user) {
      return res.boom.badRequest(err || 'Something went wrong.');
    }

    return res.json(user);
  });
});

// Get info of the current game
router.get('/game', util.isAuthenticated, function (req, res) {

});

// Start game in the table X
router.post('/game/:tableId', util.isAuthenticated, function (req, res) {

});

// Leave the current game
router.delete('/game', util.isAuthenticated, function (req, res) {

});

module.exports = router;
