var config = {};

config.mongoDB = {
  user: '',
  pass: '',
  host: 'localhost',
  port: '',
  database: 'blackjack'
};

config.server = {
  port: 3000
};

config.user = {
  startingMoney: 10000
};

// This is the only property that
// will be available to the client-side
config.client = {

};

module.exports = config;
