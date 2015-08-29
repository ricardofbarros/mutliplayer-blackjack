var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = new Schema({
  userId: Schema.Types.ObjectId,
  accessToken: String,
  game: {
    tableId: Schema.Types.ObjectId,
    token: String
  }
});

module.exports = mongoose.model('Session', Session);
