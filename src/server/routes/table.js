// Dependencies
var express = require('express');
var util = require('../util');
var lobbySocket = require('../sockets/lobby')();
var gamesSocket = require('../sockets/games')();
var Table = require('../models/Table');
var config = require('../../config');
var uuid = require('node-uuid');
var tableValidation = require('../../common/validation').table;
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
  var session = req.params.__session;

  // Run common validation
  var isNotValid = tableValidation(config.apiMsgState, payload);
  if (isNotValid) {
    return res.boom.badData(isNotValid);
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
    cards: util.generateDeck(payload.numberOfDecks)
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
