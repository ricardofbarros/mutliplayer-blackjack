// Dependencies
var Map = require('immutable').Map;
var Session = require('../models/Session');
var Table = require('../models/Table');
var TableGame = require('../models/TableGame');
var User = require('../models/User');
var DealerAI = require('../game/dealerAI');
var CurrentRound = require('../game/currentRound');
var log = require('../log');
var util = require('../util');
var _ = require('lodash');

function GamesSocket (io) {
  var self = this;
  self.io = io;
  self.servers = new Map();
}

// 20 secs to timeout actions
// and play the round
var ACTION_TIMEOUT = 20000;

GamesSocket.prototype.createGameRoom = function (tableId, gameConfigs) {
  var self = this;
  var game = this.io.of('/game-' + tableId);

  game.players = new Map();
  game.tableId = tableId;
  game.dealer = new DealerAI();
  game.cfg = gameConfigs;
  // game.currentRound = new CurrentRound(); -> Instantiated on startNewRound
  // TODO: missing game configs , numberOfDecks, bets, etc..

  // On new connection
  game.on('connection', function (socket) {
    log.info('new connection to game ' + tableId);

    // Check if the limit of players have been reached
    var numOfPlayers = game.players.size;
    if (game.cfg.maxPlayers <= numOfPlayers) {
      socket.emit('full');
      return;
    }

    // Try to handshake with socket
    socket.on('auth', function (authData) {
      log.info(authData, 'user trying to authenticate to game ' + tableId);

      // authData Structure:
      //
      // {
      //   accessToken: '',
      //   userId: ''
      // }
      //

      socket.userId = authData.userId;

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
        self.createPlayerActionsListener(game, socket);
      });
    });

    socket.on('close', function () {
      self.socketCleanUp(null, tableId, socket);

      // Just to make sure
      socket = null;
    });
  });

  this.servers = this.servers.set(tableId, game);
};

GamesSocket.prototype.socketCleanUp = function (err, tableId, userId) {
  if (err) {
    log.error(err);
  }

  log.info('user disconnected from ' + tableId);

  // Get game instance and player instance
  var game = this.servers.get(tableId);
  var socket;

  // The arg 'userId' can be the socket or the userId
  // The arg is named as 'userId'
  // because it is more usual to be the userId than the
  // actual socket
  if (typeof userId !== 'object') {
    socket = game.players.get(userId);
  } else {
    socket = userId;
    userId = socket.userId;
  }

  // The real cleanup
  if (userId) {
    this.servers = this.servers.set(tableId, game.players.delete(userId));
  }
  socket.disconnect();
};

GamesSocket.prototype.gameCleanUp = function (err, tableId) {
  if (err) {
    log.error(err);
  }

  log.info('game "' + tableId + '"is over');

  var game = this.servers.get(tableId);
  this.servers = this.servers.delete(tableId);
  game.close();
};

GamesSocket.prototype.createPlayerActionsListener = function (game, socket) {
  var self = this;
  var tableId = game.tableId;
  var userId = socket.userId;

  // Player actions:
  // HIT
  socket.on('hit', this.playerHit.bind(this, tableId, {
    player: userId
  }));

  // STAND
  socket.on('stand', this.playerStand.bind(this, tableId, {
    player: userId
  }));

  // BET
  socket.on('bet', function (amount) {
    return self.playerBet(tableId, {
      player: userId,
      amount: amount
    });
  });

  // SIT OUT
  socket.on('sitout', this.playerSitout.bind(this, tableId, {
    player: userId
  }));

  // PLAY
  socket.on('play', this.playerPlays.bind(this, tableId, {
    player: userId
  }));

  // First player
  // emit start new Round
  if (game.players.size === 0) {
    this.startNewRound(tableId);
  }

  // Store new player
  game.players = game.players.set(userId, socket);

  // Add player to sitout
  this.playerSitout(tableId, {
    player: userId
  });
};

// The big boss that starts a new round in blackjack
// Next invocation: dealCardsToAll
GamesSocket.prototype.startNewRound = function (tableId) {
  var self = this;
  var game = this.servers.get(tableId);

  return Table.kickAndIncrementSitOuts(tableId, function (err, players) {
    if (err) {
      return self.gameCleanUp(err, tableId);
    }

    // players Structure:
    //
    // {
    //   kicked: [userId..],
    //   seatedOut: [userId...],
    //   playing: [userId...]
    // }
    //

    // Emit event(s) to inform who were kicked
    // from the game
    players.kicked.forEach(function (playerKicked) {
      return self.kickPlayer({
        player: playerKicked
      });
    });

    // Same thing but for the players seated out
    players.seatedOut.forEach(function (playerSeatedOut) {
      return self.playerSitout({
        player: playerSeatedOut
      });
    });

    // create a current round instance
    game.currentRound = new CurrentRound(players.playing);

    // Start a action time out
    var timeOut = setTimeout(function () {
      self.dealCardsToAll();
    }, ACTION_TIMEOUT);

    // Wait for bets finished event
    game.currentRound.on('betsFinished', function () {
      clearTimeout(timeOut);
      self.dealCardsToAll();
    });

    return self.handleDataFlush('startNewRound', tableId);
  });
};

// Kick inactive player
// NOTE: Kick === Sitout for 5 rounds!
GamesSocket.prototype.kickPlayer = function (tableId, data) {
  return this.handleDataFlush('kickPlayer', tableId, data);
};

// Deal cards to all players and the dealer
// Next invocation: dealCardsToDealer
GamesSocket.prototype.dealCardsToAll = function (tableId) {
  var self = this;
  var game = this.servers.get(tableId);
  var players = game.players;

  var numOfCards = (players.size * 2) + 2;

  return TableGame.popNumOfCards(tableId, numOfCards, function (err, cards) {
    if (err) {
      return self.gameCleanUp(err, tableId);
    }

    // This card will be the dealer's hidden card
    var lastCard = cards.pop();

    var c = 0;
    var deal = function () {
      players.forEach(function (player) {

      });
      // Deal to dealer
    };

    // Deal 2 x card to each player (dealer included)
    deal();
    deal();
  });


  // Start a action time out
  var timeOut = setTimeout(function () {
    self.dealCardsToDealer();
  }, ACTION_TIMEOUT);

  // Wait for plays finished event
  game.currentRound.on('playsFinished', function () {
    clearTimeout(timeOut);
    self.dealCardsToDealer();
  });

  return this.handleDataFlush('dealCardsToAll', tableId);
};

// When the players turn is over
// after all players have played (hit / stand)
// It's dealer turn
// Next invocation: endRound
GamesSocket.prototype.dealCardsToDealer = function (tableId) {

};

// End the round
// send to users who won and who lost
// propagate those changes on the database
// Next invocation: startNewRound or newSetOfCards
GamesSocket.prototype.endRound = function (tableId) {

};

// When the game doesn't have enough cards to proceed
// to gameplay this method will generate and shuffle
// new decks of cards
// Next invocation: startNewRound
GamesSocket.prototype.newSetOfCards = function (tableId) {
  var self = this;
  var game = this.servers.get(tableId);

  var cards = util.generateDecks(game.cfg.numberOfDecks);
  cards = _.shuffle(_.shuffle(_.shuffle(_.shuffle(cards))));

  return TableGame.replaceCards(tableId, cards, function (err) {
    if (err) {
      return self.gameCleanUp(err, tableId);
    }

    return self.handleDataFlush('newSetOfCards', game);
  });
};

// Game was halted
GamesSocket.prototype.gameHalt = function (tableId) {

};

GamesSocket.prototype.playerStand = function (tableId, data) {
  var userId = data.player;

  log.info(userId, 'Player stand');

  return this.handleDataFlush('playerStand', tableId, data);
};

GamesSocket.prototype.playerSitout = function (tableId, data) {
  var self = this;
  var userId = data.player;

  return Table.addSitOut(tableId, userId, function (err) {
    if (err) {
      return self.socketCleanUp(err, tableId, userId);
    }

    log.info(userId, 'Player seated out');

    return self.handleDataFlush('playerSitout', tableId, data);
  });
};

GamesSocket.prototype.playerHit = function (tableId, data) {
  var self = this;
  var userId = data.player;

  return TableGame.popCard(function (err, card) {
    if (err) {
      return self.socketCleanUp(err, tableId, userId);
    }

    log.info(userId, 'Player hit a card');
    data.card = card;

    return self.handleDataFlush('playerHit', tableId, data);
  });
};

GamesSocket.prototype.playerBet = function (tableId, data) {
  var self = this;
  var userId = data.player;
  var amount = data.amount;

  return User.withdrawal(userId, amount, function (err, accountBalance) {
    if (err) {
      return self.socketCleanUp(err, tableId, userId);
    }

    log.info(userId, 'Player bet');
    data.accountBalance = accountBalance;

    return self.handleDataFlush('playerBet', tableId, data);
  });
};

GamesSocket.prototype.playerPlays = function (tableId, data) {
  var self = this;
  var userId = data.player;

  return Table.removeSitOut(tableId, userId, function (err) {
    if (err) {
      return self.socketCleanUp(err, tableId, userId);
    }

    log.info(userId, 'Player started playing');

    return self.handleDataFlush('playerPlays', tableId, data);
  });
};

GamesSocket.prototype.playerHasJoined = function () {

};

GamesSocket.prototype.playerHasLeft = function () {

};

GamesSocket.prototype.handleDataFlush = function (apiMethod, tableId, data) {
  // tableId arg can be the game object
  var game;
  if (typeof tableId === 'object') {
    game = tableId;
  } else {
    game = this.servers.get(tableId);
  }

  // Emit to everyone interested
  game.players.forEach(function (socket) {
    socket.emit(apiMethod, data);
  });

  // Store all changes done
  // if there is data associated
  if (data) {
    game.currentRound[apiMethod](data);
    this.servers = this.servers.set(tableId, game);
  }
};

var gamesSocketInstance;

module.exports = function (io) {
  if (!gamesSocketInstance) {
    gamesSocketInstance = new GamesSocket(io);
  }

  return gamesSocketInstance;
};
