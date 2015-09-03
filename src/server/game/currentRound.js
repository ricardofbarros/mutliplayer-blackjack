// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Map = require('immutable').Map;

function CurrentRound (playersPlaying, dealerHand) {
  // Structure :
  //
  // playersPlaying || playersStand = Map(id: {
  // 	hand: [card, card, ...],
  // 	bet: Number,
  // 	stand: false
  // });
  //
  // dealerHand = {
  // 	visible: [],
  // 	hidden: ''
  // };
  //

  this.dealerHand = dealerHand;
  this.playersPlaying = Map(playersPlaying);
  this.playersStand = Map();
}

util.inherits(CurrentRound, EventEmitter);

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
  var player = this.playersPlaying.get(playerId);
  this.playersPlaying = this.playersPlaying.delete(playerId);

  // Move player to playersStand
  this.playersStand = this.playersStand.set(playerId, player);
};

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
