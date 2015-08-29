// Dependencies
var express = require('express');
var http = require('http');
var SocketIo = require('socket.io');
var routes = require('./routes');
var boom = require('express-boom');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config');

// Connect to mongo
var mongoConnectionString = (function () {
  var mongoCfg = config.mongoDB;
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
})();
mongoose.connect('mongodb://' + mongoConnectionString);

// Create the services
var app = express();
var server = http.createServer(app);
var io = SocketIo(server);

io.on('connection', function (socket) {
  socket.on('create', function (room) {
    socket.join(room);
  });
});

// Middlewares
app.use(boom());
app.use(bodyParser.json());

// Server static content
app.use('/public', express.static('public'));

// Web API routes
app.use('/api', routes);

server.listen(3000);
