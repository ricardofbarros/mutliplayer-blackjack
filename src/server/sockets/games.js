// Dependencies
var Map = require('immutable').Map;
var Session = require('../models/Session');
var Table = require('../models/Table');
var TableGame = require('../models/TableGame');
var User = require('../models/User');
var DealerAI = require('../game/dealerAI');
var CurrentRound = require('../game/currentRound');
var log = require('../log');

function GamesSocket (io) {
  var self = this;
  self.io = io;
  self.servers = new Map();
}

GamesSocket.prototype.createGameRoom = function (tableId) {
  var self = this;
  var game = this.io.of('/game-' + tableId);
  game.players = new Map();
  game.tableId = tableId;
  game.dealer = new DealerAI();

  // On new connection
  game.on('connection', function (socket) {
    log.info('new connection to game ' + tableId);

    // Try to handshake with socket
    socket.on('auth', function (authData) {
      log.info(authData, 'user trying to authenticate to game ' + tableId);

      authData = authData || {};
      authData.accessToken = authData.accessToken || 'fail';
      return Session.find({ accessToken: authData.accessToken }, function (err, session) {
        session = session[0] || false;

        if (err || !session) {
          socket.disconnect();
          return;
        }

        log.info(authData, 'authentication successful!!');

        // Listen actions from the new player
        self.createPlayerActionsListener(game, socket, authData.user);
      });
    });

    socket.on('close', function () {
      self.socketCleanUp(null, tableId, socket);

      // Just to make sure
      socket = null;
    });
  });

  self.servers.set(tableId, game);
};

GamesSocket.prototype.socketCleanUp = function (err, tableId, socket) {
  if (err) {
    log.error(err);
  }

  log.info('user disconnected from ' + tableId);

  var game = this.servers.get(tableId);
  this.servers = this.servers.set(tableId, game.players.delete(socket.id));
  socket.disconnect();
};

GamesSocket.prototype.createPlayerActionsListener = function (game, socket, user) {
  var self = this;
  var tableId = game.tableId;

  // Player actions:

  // HIT
  socket.on('hit', function () {
    return TableGame.popCard(function (err, card) {
      if (err) {
        return self.socketCleanUp(err, tableId, socket);
      }

      log.info(user, 'Player hit a card');

      self.playerHit(tableId, {
        player: user,
        card: card
      });

      game.currentRound.playerHit(user.id, card);
    });
  });

  // STAND
  socket.on('stand', function () {
    self.playerStand(tableId, { player: user }, function () {

      log.info(user, 'Player stand');

      self.playerStand(tableId, {
        player: user
      });

      game.currentRound.playerStand(user.id);
    });
  });

  // BET
  socket.on('bet', function (amount) {
    return User.withdrawal(user.id, amount, function (err, accountBalance) {
      if (err) {
        return self.socketCleanUp(err, tableId, socket);
      }

      log.info(user, 'Player bet');

      self.playerBet(tableId, {
        player: user,
        amount: amount,
        accountBalance: accountBalance
      });

      game.currentRound.playerBet(user.id, amount);
    });
  });

  // SIT OUT HANDLER
  var sitOut = function () {
    return Table.addSitOut(tableId, user.id, function (err) {
      if (err) {
        return self.socketCleanUp(err, tableId, socket);
      }

      log.info(user, 'Player seated out');

      self.playerSitout(tableId, { player: user });
    });
  };

  // SIT OUT EVENT
  socket.on('sitout', sitOut);

  // PLAY
  socket.on('play', function () {
    return Table.removeSitOut(tableId, user.id, function (err) {
      if (err) {
        return self.socketCleanUp(err, tableId, socket);
      }

      log.info(user, 'Player started playing');

      self.playerSitout(tableId, { player: user });
    });
  });

  // First player
  // emit start new Round
  if (game.players.size === 0) {
    self.startNewRound(tableId);
  }

  // Store player
  game.players.set(socket.id, socket);

  // Add player to sitout
  sitOut();
};

GamesSocket.prototype.startNewRound = function (tableId) {
  // emitToAll('startNewRound', tableId)
};

// After all players have played (hit / stand)
// dealer
GamesSocket.prototype.dealCardsToDealer = function () {

};

// After the startNewRound and everybody has betted
// or 20ses had passed
GamesSocket.prototype.dealCardsToAll = function () {

};

// Kick inactive player
// NOTE: Kick === Sitout for 5 rounds!
GamesSocket.prototype.kickPlayer = function () {

};

// End the round
// send to users who won and who lost
// propagate those changes on the database
GamesSocket.prototype.endRound = function (tableId) {

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
  GamesSocket.prototype[apiMethod] = function (tableId, data) {
    return emitToAll(apiMethod, tableId, data);
  };
});

function emitToAll (apiMethod, tableId, data) {
  var sockets = this.servers.get(tableId);

  sockets.players.forEach(function (socket) {
    socket.emit(apiMethod, data);
  });
}

function handleError () {

}

var gamesSocketInstance;

module.exports = function (io) {
  if (!gamesSocketInstance) {
    gamesSocketInstance = new GamesSocket(io);
  }

  return gamesSocketInstance;
};
