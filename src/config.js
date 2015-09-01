// Dependencies
var url = require('url');

var config = {};

config.mongoDB = {
  user: '',
  pass: '',
  host: 'localhost',
  port: '',
  database: 'blackjack'
};

config.server = {
  hostname: 'localhost',
  port: 3000,
  protocol: 'http:',
  slashes: true
};

config.apiMsgState = {
  user: {
    MISSING_PARAMS: 'MISSING_PARAMS',
    USER_EXISTS: 'USER_EXISTS',
    PASSWORD_MATCH: 'PASSWORD_MATCH',
    CREATED_USER: 'CREATED_USER'
  }
};

config.user = {
  startingMoney: 10000,
  saltHash: process.env.BJ_SALT_HASH
};

// This is the only property that
// will be available to the client-side
config.client = {
  server: config.server,
  baseUrl: url.format(config.server),
  apiMsgState: config.apiMsgState
};

module.exports = config;
