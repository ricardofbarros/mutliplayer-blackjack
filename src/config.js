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

config.user = {
  startingMoney: 10000,
  saltHash: process.env.BJ_SALT_HASH
};

// This is the only property that
// will be available to the client-side
config.client = {
  server: config.server
};

module.exports = config;
