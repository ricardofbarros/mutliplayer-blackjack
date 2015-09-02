// Dependencies
var HashMap = require('hashmap');
var Session = require('../models/Session');

function LobbySocket (io) {
  var self = this;
  self.server = io.of('/lobby');
  self.sockets = new HashMap();

  // On new connection
  self.server.on('connection', function (socket) {
    // Try to handshake with socket
    socket.on('auth', function (data) {
      data = data || {};
      data.accessToken = data.accessToken || 'fail';
      return Session.find({ accessToken: data.accessToken }, function (err, session) {
        session = session[0] || false;

        if (err || !session) {
          socket.disconnect();
          return;
        }

        // Store trusted socket
        self.sockets.set(socket.id, socket);
      });
    });

    socket.on('close', function () {
      socket.disconnect();
      self.sockets.remove(socket.id);
      socket = null;
    });
  });
}

var apiMethods = [
  'addTable',
  'removeTable',
  'updateTable'
];

// Construct dynamically LobbySocket api
apiMethods.forEach(function (apiMethod) {
  LobbySocket.prototype[apiMethod] = function (data) {
    this.sockets.forEach(function (socket) {
      socket.emit(apiMethod, data);
    });
  };
});

var lobbySocketInstance;

module.exports = function (io) {
  if (!lobbySocketInstance) {
    lobbySocketInstance = new LobbySocket(io);
  }

  return lobbySocketInstance;
};
