// Dependencies
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

    // var tableOut = tables.map()

    return res.json();
  });
});

// Create new table
router.post('/', util.isAuthenticated, function (req, res) {
  var payload = req.body;
  var paramsKeys = Object.keys(payload);
  var paramsRequired = [
    'name',
    'moneyLimit',
    'playersLimit'
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

  var table = new Table({
    name: payload.name,
    createdDate: new Date(),
    tableLimit: {
      money: parseInt(payload.moneyLimit, 10),
      players: parseInt(payload.playersLimit, 10)
    }
  });

  return table.save(function (err) {
    if (err) {
      return res.boom.badRequest(err);
    }

    return res.status(201).json({
      message: 'Created table with success'
    });
  });
});

module.exports = router;
