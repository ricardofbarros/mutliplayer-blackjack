var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var routes = require('./routes');
var boom = require('express-boom');
var bodyParser = require('body-parser');

io.on('connection', function (socket) {
  socket.on('create', function (room) {
    socket.join(room);
  });
});

app.use(boom());
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use('/api', routes);

server.listen(3000);
