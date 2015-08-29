var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Table = new Schema({
  name: String,
  createdDate: Date,
  sittingPlayers: [{
    userId: Schema.Types.ObjectId,
    money: Number
  }],
  tableLimit: {
    money: Number,
    players: Number
  }
});

module.exports = mongoose.model('Table', Table);
