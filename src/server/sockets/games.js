// Dependencies
var HashMap = require('hashmap');
var Session = require('../models/Session');

function GamesSocket (io) {
  var self = this;
  self.io = io;
  self.servers = new HashMap();
}

GamesSocket.prototype.createGameRoom = function (tableId) {
  var self = this;
  var game = this.io.of('/game-' + tableId);
  game.players = new HashMap();

  // On new connection
  game.on('connection', function (socket) {
    // Try to handshake with socket
    socket.on('auth', function (authData) {
      authData = authData || {};
      authData.accessToken = authData.accessToken || 'fail';
      return Session.find({ accessToken: authData.accessToken }, function (err, session) {
        session = session[0] || false;

        if (err || !session) {
          socket.disconnect();
          return;
        }

        // Listen actions from the new player
        self.createPlayerActionsListener(tableId, socket, authData.user);
      });
    });

    socket.on('close', function () {
      socket.disconnect();
      game.players.remove(socket.id);
      socket = null;
    });
  });
};

GamesSocket.prototype.createPlayerActionsListener = function (tableId, socket, user) {
  var self = this;

  // Player actions:
  socket.on('hit', function () {
    self.playerHit(tableId, { player: user }, function () {

    });
  });
  socket.on('stand', function () {
    self.playerStand(tableId, { player: user }, function () {

    });
  });
  socket.on('bet', function () {
    self.playerBet(tableId, { player: user }, function () {

    });
  });
  socket.on('sitout', function () {
    self.playerSitout(tableId, { player: user }, function () {

    });
  });

  // Get list of players in this game
  // push more one socket(player)
  // to the list of the players
  var players = self.servers.get(tableId);
  players.push(socket);
  self.servers.set(tableId, players);
};

GamesSocket.prototype.startNewRound = function () {

};

GamesSocket.prototype.dealCardsToDealer = function () {

};

GamesSocket.prototype.dealCardsToAll = function () {

};

GamesSocket.prototype.kickPlayer = function () {

};

var apiPlayerMethods = [
  'playerStand',
  'playerSitout',
  'playerHit',
  'playerBet',

  // Methods invoked by API
  // not the player
  'playerJoin',
  'playerLeave'
];

// Construct dynamically GamesSockets Player actions api
apiPlayerMethods.forEach(function (apiMethod) {
  GamesSocket.prototype[apiMethod] = function (tableId, data, fn) {
    var sockets = this.servers.get(tableId);

    sockets.forEach(function (socket) {
      socket.emit(apiMethod, data);
    });

    if (typeof fn === 'function') {
      fn();
    }
  };
});

var gamesSocketInstance;

module.exports = function (io) {
  if (!gamesSocketInstance) {
    gamesSocketInstance = new GamesSocket(io);
  }

  return gamesSocketInstance;
};
