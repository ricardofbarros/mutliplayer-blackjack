var config = {};

config.mongoDB = {
  user: '',
  pass: '',
  host: 'localhost',
  port: '',
  database: 'blackjack'
};

// This is the only property that
// will be available to the client-side
config.client = {

};

module.exports = config;
