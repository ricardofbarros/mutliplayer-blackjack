// Dependencies
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Map = require('immutable').Map;

function CurrentRound (playersPlaying, dealerHand) {
  // Structure :
  //
  // playersPlaying = Map(id: {
  // 	hand: [card, card, ...],
  // 	bet: Number,
  // });
  //
  // dealerHand = {
  // 	visible: [],
  // 	hidden: ''
  // };
  //

  this.dealerHand = dealerHand;
  this.playersPlaying = Map(playersPlaying);
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

CurrentRound.prototype.dealerHit = function (card) {
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
