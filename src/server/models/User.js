var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  password: String,
  accountBalance: Number
});

User.statics.withdrawal = function (id, amount, cb) {
  return this.findOneAndUpdate({ _id: id }, {
    $inc: { accountBalance: -amount }
  }, {
    new: true
  }, function (err, user) {
    if (err) {
      return cb(err);
    }

    return cb(user.accountBalance);
  });
};

module.exports = mongoose.model('User', User);
