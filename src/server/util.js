// Dependencies
var Session = require('./models/Session');
var crypto = require('crypto');
var config = require('../config');

var util = {};

util.isAuthenticated = function (req, res, next) {
  var accessToken;
  if (!req.query || !req.query.accessToken) {
    if (!req.params || !req.params.accessToken) {
      return res.boom.unauthorized('Missing access token.');
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
      return res.boom.unauthorized('Invalid access token.');
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
    id: table.id,
    name: table.name,
    createdDate: table.createdDate,
    sittingPlayers: table.sittingPlayers,
    tableLimit: table.tableLimit,
    numberOfDecks: table.numberOfDecks
  };
};

util.generateDeck = function () {

};

module.exports = util;
