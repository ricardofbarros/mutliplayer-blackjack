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
  misc: {
    MISSING_PARAMS: 'Missing params'
  },
  user: {
    USER_EXISTS: 'User already exists',
    PASSWORD_MATCH: 'Passwords doesn\'t match',
    CREATED_USER: 'User created with success!'
  },
  session: {
    USER_NOT_FOUND: 'User not found',
    LOGIN_SUCCESS: 'Logging in..'
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
