// Dependencies
var Session = require('./models/Session');
var crypto = require('crypto');
var config = require('../config');

var util = {};

util.isAuthenticated = function (req, res, next) {
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
    sittingPlayers: table.sittingPlayers || [],
    tableLimit: table.tableLimit
  };
};

module.exports = util;
