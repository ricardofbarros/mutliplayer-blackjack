// Dependencies
var express = require('express');
var http = require('http');
var SocketIo = require('socket.io');
var router = require('./router');
var boom = require('express-boom');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config');
var util = require('./util');
var lobbySocket = require('./sockets/lobby');

// Connect to mongo
var mongoConnectionString = util.createMongoConnectionStr(config.mongoDB);
mongoose.connect('mongodb://' + mongoConnectionString);

// Create the services
var app = express();
var server = http.createServer(app);
var io = SocketIo(server);

// Open the socket in charge of the lobby
lobbySocket(io);

// Server static content
app.use('/public', express.static('public'));

// Middlewares
app.use(boom());
app.use(bodyParser.json());

// Web API routes
app.use('/api', router);

server.listen(config.server.port);
