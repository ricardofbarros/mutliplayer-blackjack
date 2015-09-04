var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TableGame = require('./TableGame');

var Table = new Schema({
  name: String,
  createdDate: Date,
  tableLimit: { // Change key to config
    maxBuyIn: Number, // TODO change name of this
    players: Number // TODO change to maxPlayers
  },
  numberOfDecks: Number,
  sittingPlayers: [{
    userId: Schema.Types.ObjectId,
    money: Number // TODO Remove this
  }],
  cards: Array
});

Table.static.kickAndIncrementSitOuts = function (tableId, cb) {
  var self = this;

  return TableGame.findOne({ tableId: tableId }, function (err, tableGame) {
    if (err || !tableGame) {
      return cb(err || new Error('Didn\'t find the table'));
    }

    // remove / kick players
    var playersKicked = [];
    var playersSeatedOut = [];
    tableGame.playersSeatedOut.filter(function (player) {
      if (!player.rounds < 6) {
        playersKicked.push(player.userId);
        return false;
      }

      playersSeatedOut.push(player.userId);
      return true;
    });

    // Increment rounds to the players that are still seated
    tableGame.playersSeatedOut.map(function (player) {
      player.rounds++;
      return player;
    });

    return self.findById(tableId, function (err, table) {
      if (err) {
        return cb(err);
      }

      var playersPlaying = [];

      // Filter the players we kicked and add the players
      // that are playing
      table.sittingPlayers.filter(function (sittingPlayer) {
        if (playersSeatedOut.indexOf(sittingPlayer.userId) === -1) {
          playersPlaying.push(sittingPlayer.userId);
        }

        return playersKicked.indexOf(sittingPlayer.userId) < 0;
      });

      // Save operations
      return tableGame.save(function (err) {
        if (err) {
          return cb(err);
        }

        return table.save(function (err) {
          return cb(err, {
            seatedOut: playersSeatedOut,
            kicked: playersKicked,
            playing: playersPlaying
          });
        });
      });
    });
  });
};

module.exports = mongoose.model('Table', Table);
