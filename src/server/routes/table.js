var express = require('express');
var util = require('../util');
var Table = require('../models/Table');
var router = express.Router();

// Route mount path: /api/table

// Get all tables available
router.get('/', util.isAuthenticated, function (req, res) {
  return Table.find({}, function (err, tables) {
    if (err) {
      return res.boom.badRequest(err);
    }

    return res.end();
  });
});

module.exports = router;
