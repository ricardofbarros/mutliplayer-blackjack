// Dependencies
var Session = require('./models/Session');

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
    req.params.userId = session.userId;

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

module.exports = util;
