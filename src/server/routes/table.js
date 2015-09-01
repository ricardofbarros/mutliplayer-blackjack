// Dependencies
var express = require('express');
var util = require('../util');
var lobbySocket = require('../sockets/lobby')();
var gamesSocket = require('../sockets/games')();
var Table = require('../models/Table');
var uuid = require('node-uuid');
var router = express.Router();

// Route mount path: /api/table

// Get all tables available
router.get('/', util.isAuthenticated, function (req, res) {
  return Table.find({}, function (err, tables) {
    if (err) {
      return res.boom.badRequest(err);
    }

    var tablesInterface = tables.map(util.tableInterfaceMap);
    return res.status(200).json({
      tables: tablesInterface
    });
  });
});

// Create new table
router.post('/', util.isAuthenticated, function (req, res) {
  var payload = req.body;
  var paramsKeys = Object.keys(payload);
  var session = req.params.__session;
  var paramsRequired = [
    'name',
    'moneyLimit',
    'playersLimit',
    'numberOfDecks',
    'buyin'
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
    return res.boom.badData('Missing params');
  }

  var table = new Table({
    id: uuid.v4(),
    name: payload.name,
    createdDate: new Date(),
    tableLimit: {
      money: parseInt(payload.moneyLimit, 10),
      players: parseInt(payload.playersLimit, 10)
    },
    numberOfDecks: payload.numberOfDecks,
    sittingPlayers: [{
      userId: session.userId,
      money: payload.buyin
    }],
    cards: util.generateDeck(table.numberOfDecks)
  });

  return table.save(function (err) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // Emit changes to ws
    lobbySocket.addTable(util.tableInterfaceMap(table));

    return res.status(201).json({
      message: 'Created table with success'
    });
  });
});

module.exports = router;
