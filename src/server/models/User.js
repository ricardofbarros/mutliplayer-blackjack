// Dependencies
var mongoose = require('mongoose');
var async = require('async');
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

User.statics.giveMoneyTo = function (data, cb) {
  var amountObj = {};

  var $orQueryBuilder = function () {
    var $orQuery = [];

    data.forEach(function (user) {
      amountObj[user.id] = data.amount;
      $orQuery.push({ _id: user.id });
    });

    return $orQuery;
  };

  return this.find({
    $or: $orQueryBuilder()
  }, function (err, users) {
    if (err) {
      return cb(err);
    }

    return async.each(users, function (user, done) {
      user.accountBalance += amountObj[user.id];
      return user.save(done);
    }, cb);
  });
};

module.exports = mongoose.model('User', User);
