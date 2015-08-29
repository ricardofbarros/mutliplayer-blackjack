var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = new Schema({
  accessToken: String,
  game: {
    tableId: Schema.Types.ObjectId,
    token: String
  }
});

module.exports = Session;
