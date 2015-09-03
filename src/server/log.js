// Dependencies
var config = require('../config');
var bunyan = require('bunyan');

module.exports = bunyan.createLogger(config.bunyan);
