// Dependencies
var express = require('express');
var util = require('../util');
var LobbySocketFactory = require('../sockets/lobby');
var Store = require('../store');
var uuid = require('node-uuid');
var router = express.Router();
var lobbySocket = LobbySocketFactory();

// Route mount path: /api/table

// Get all tables available
router.get('/', util.isAuthenticated, function (req, res) {
  var tablesKeys = Store.keys().filter(function (key) {
    return key.substr(0, 6) === 'table:';
  });

  var tables = [];
  tablesKeys.forEach(function (key) {
    tables.push(util.tableInterfaceMap(Store.get(key)));
  });

  return res.status(200).json({
    tables: tables
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
    return (paramsKeys.indexOf(param) > -1);
  });
  if (!checkRequired) {
    return res.boom.badData('Missing params');
  }

  var table = {
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
  };

  Store.set('table:' + table.id, table);

  // Emit changes to ws
  lobbySocket.addTable(util.tableInterfaceMap(table));

  return res.status(201).json({
    message: 'Created table with success'
  });
});

module.exports = router;
