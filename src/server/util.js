// Dependencies
var Session = require('./models/Session');
var crypto = require('crypto');
var config = require('../config')

var TOKEN_EXPIRED = config.apiMsgState.session.TOKEN_EXPIRED;

var util = {};

util.isAuthenticated = function (req, res, next) {
  var accessToken;
  if (!req.query || !req.query.accessToken) {
    if (!req.params || !req.params.accessToken) {
      return res.boom.unauthorized(TOKEN_EXPIRED);
    }
    accessToken = req.params.accessToken;
  } else {
    accessToken = req.query.accessToken;
  }

  return Session.findOne({ accessToken: accessToken }, function (err, session) {
    if (err) {
      return res.boom.badRequest(err);
    }

    if (!session) {
      return res.boom.unauthorized(TOKEN_EXPIRED);
    }

    if (!req.params) {
      req.params = {};
    }
    req.params.__session = session;

    return next();
  });
};

util.createMongoConnectionStr = function (mongoCfg) {
  var connectionStr = '';

  if (mongoCfg.user || mongoCfg.pass) {
    connectionStr += mongoCfg.user + ':' + mongoCfg.pass + '@';
  }

  connectionStr += mongoCfg.host;

  if (mongoCfg.port) {
    connectionStr += ':' + mongoCfg.port;
  }

  if (mongoCfg.database) {
    connectionStr += '/' + mongoCfg.database;
  }

  return connectionStr;
};

util.hashPassword = function (pass) {
  var shasum = crypto.createHash('sha256');
  return shasum.update(pass + config.user.saltHash).digest('hex');
};

util.tableInterfaceMap = function (table) {
  return {
    id: table._id,
    name: table.name,
    createdDate: table.createdDate,
    sittingPlayers: table.sittingPlayers,
    tableLimit: table.tableLimit,
    numberOfDecks: table.numberOfDecks
  };
};

util.sessionInterfaceMap = function (session, user) {
  return {
    id: user._id,
    username: user.username,
    accountBalance: user.accountBalance,
    accessToken: session.accessToken,
    game: {
      tableId: session.game.tableId || null,
      token: session.game.token || null
    }
  };
};

util.generateDeck = function (numberOfDecks) {
  var suits = [
    'c', // clubs
    'd', // diamonds
    'h', // hearts
    's' // spades
  ];
  var deck = [];

  suits.forEach(function (suit) {
    for (var i = 1; i < 13; i++) {
      deck.push(suit + i);
    }
  });

  return deck;
};

module.exports = util;
