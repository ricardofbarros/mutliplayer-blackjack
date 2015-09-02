var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Table = new Schema({
  name: String,
  createdDate: Date,
  tableLimit: {
    maxBuyIn: Number,
    players: Number
  },
  numberOfDecks: Number,
  sittingPlayers: [{
    userId: Schema.Types.ObjectId,
    money: Number
  }],
  cards: Array
});

module.exports = mongoose.model('Table', Table);
