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
  }, cb);
};

module.exports = mongoose.model('TableGame', TableGame);
