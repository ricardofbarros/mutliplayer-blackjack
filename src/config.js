// Dependencies
var url = require('url');

var config = {};

config.reverseProxy = process.env.BJ_REVERSE_PROXY || false;

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
    INVALID_USER_FIELD: 'Invalid username, please use alphanumeric and underscore characters only',
    INVALID_PASS_FIELD: 'Invalid password, please use alphanumeric and underscore characters only',
    CREATED_USER: 'User created with success!'
  },
  session: {
    USER_NOT_FOUND: 'User not found',
    LOGIN_SUCCESS: 'Logging in..',
    ALREADY_PLAYING: 'You\'re already playing'
  },
  table: {
    INVALID_NAME_FIELD: 'Invalid table name, please use alphanumeric and underscore characters only',
    MAX_BUYIN: 'The maximum table buyin should be between 1 and 1000',
    BUYIN: 'Your buyin shouldn\'t be bigger than the table maximum buyin',
    NUMBER_DECKS: 'The number of decks per table should be between 1 and 6',
    PLAYERS_LIMIT: 'The number of players per table should be between 1 and 4',
    TABLE_FULL: 'This table is full, the maximum players per table is 4'
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
