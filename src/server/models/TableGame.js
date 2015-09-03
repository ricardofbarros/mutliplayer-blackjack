var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableGame = new Schema({
  tableId: Schema.Types.ObjectId,
  playersSeatedOut: [{
    userId: Schema.Types.ObjectId,
    rounds: Number
  }],
  cards: Array
});

TableGame.statics.popCard = function (tableId, cb) {
  return this.findOneAndUpdate({ tableId: tableId }, {
    $pop: { cards: -1 }
  }, {
    new: true
  }, function (err, tableGame) {
    if (err) {
      return cb(err);
    }

    return cb(tableGame.cards[0]);
  });
};

TableGame.static.addSitOut = function (tableId, userId, cb) {
  return this.update({
    tableId: tableId
  }, {
    $addToSet: {
      playersSeatedOut: {
        userId: userId,
        rounds: 1
      }
    }
  }, cb);
};

TableGame.static.removeSitOut = function (tableId, userId, cb) {
  return this.update({
    tableId: tableId
  }, {
    $pull: { 'playersSeatedOut.userId': userId }
  }, cb);
};

TableGame.static.kickSitOuts = function (tableId, cb) {
  return this.update({}, {
    $pull: { 'playersSeatedOut.rounds': { $gt: 5 } }
  }, cb);
};

module.exports = mongoose.model('TableGame', TableGame);
