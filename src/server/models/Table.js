var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Table = new Schema({
  name: String,
  createdDate: Date,
  tableLimit: {
    money: Number,
    players: Number
  },
  numberOfDecks: Number
});

module.exports = mongoose.model('Table', Table);
