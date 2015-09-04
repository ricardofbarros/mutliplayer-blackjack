// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Map = require('immutable').Map;

function CurrentRound (playersPlaying) {
  var players = {};
  playersPlaying.forEach(function (id) {
    players[id] = {
      hand: [],
      bet: 0,
      stand: false
    };
  });

  this.dealerHand = {
    visible: [],
    hidden: ''
  };
  this.playersPlaying = Map(players);
  this.playersStand = Map();
}

util.inherits(CurrentRound, EventEmitter);

/*              START GAME EVENTS                 */

CurrentRound.prototype.playerBet = function (playerId, bet) {
  var player = this.playersPlaying.get(playerId);
  player.bet = bet;

  this.playersPlaying = this.playersPlaying.set(playerId, player);
};

CurrentRound.prototype.playerHit = function (playerId, card) {
  var player = this.playersPlaying.get(playerId);
  player.hand.push(card);

  this.playersPlaying = this.playersPlaying.set(playerId, player);
};

CurrentRound.prototype.playerStand = function (playerId) {
  // TODO review this
  var player = this.playersPlaying.get(playerId);
  this.playersPlaying = this.playersPlaying.delete(playerId);

  // Move player to playersStand
  this.playersStand = this.playersStand.set(playerId, player);
};

// Empty methods, we never known when we might need this
CurrentRound.prototype.playerSitout = function () {};
CurrentRound.prototype.playerPlays = function () {};
CurrentRound.prototype.endRound = function () {};
CurrentRound.prototype.startNewRound = function () {};
CurrentRound.prototype.dealCardsToAll = function () {};
CurrentRound.prototype.dealCardsToDealer = function () {};
CurrentRound.prototype.kickPlayer = function () {};
CurrentRound.prototype.dealHiddenCard = function () {};
CurrentRound.prototype.newSetOfCards = function () {};

/*              END GAME EVENTS                 */

CurrentRound.prototype.dealerHit = function (card, hidden) {
  if (hidden) {
    this.dealerHand.hidden = card;
    return;
  }
  this.dealerHand.visible.push(card);
};

CurrentRound.prototype.showDealerHiddenCard = function () {
  this.dealerHand.visible.push(this.dealerHand.hidden);
  this.dealerHand.hidden = false;
};

CurrentRound.prototype.getHands = function () {
  var hands = {};
  hands.dealer = this.dealerHand.visible;

  this.playersPlaying.forEach(function (player, i) {
    hands[i] = player.hand;
  });
};

CurrentRound.prototype.getBets = function () {
  var bets = {};

  this.playersPlaying.forEach(function (player, i) {
    bets[i] = player.bet;
  });
};

module.exports = CurrentRound;
