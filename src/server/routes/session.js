// Dependencies
var express = require('express');
var util = require('../util');
var User = require('../models/User');
var Session = require('../models/Session');
var Table = require('../models/Table');
var uuid = require('node-uuid');
var router = express.Router();

// Route mount path: /api/session

// Sign in
router.post('/', function (req, res) {
  var payload = req.body;

  if (!payload.username || !payload.password) {
    return res.boom.badData('Missing params');
  }

  return User.findOne({
    username: payload.username,
    password: util.hashPassword(payload.password)
  }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    if (!user) {
      return res.boom.badData('User not found');
    }

    var accessToken = uuid.v4();
    var session = new Session({
      userId: user._id,
      accessToken: accessToken
    });

    return session.save(function (err) {
      if (err) {
        return res.boom.badRequest(err);
      }

      return res.status(201).json({
        accessToken: accessToken
      });
    });
  });
});

// Get info about himself
router.get('/user', util.isAuthenticated, function (req, res) {
  var userId = req.params.__session.userId;

  return User.findById(userId, function (err, user) {
    if (err || !user) {
      return res.boom.badRequest(err || 'Something went wrong.');
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      accountBalance: user.accountBalance
    });
  });
});

// Get info of the current game
router.get('/game', util.isAuthenticated, function (req, res) {
  var session = req.params.__session;

  // User isn't playing currently
  if (!session.game || !session.game.tableId || !session.game.token) {
    return res.status(200).json({
      table: null,
      gameToken: null
    });
  }

  return Table.findById(session.game.tableId, function (err, table) {
    if (err) {
      return res.boom.badRequest(err);
    }

    // If we didnt find a table
    // return a 410 to inform the client
    // this resource is no longer available
    if (!table) {
      return res.boom.resourceGone('Table is gone');
    }

    return res.status(200).json({
      table: util.tableInterfaceMap(table),
      gameToken: session.game.token
    });
  });
});

// Start game in the table X
router.put('/game/:tableId', util.isAuthenticated, function (req, res) {
  var payload = req.body;

  if (!payload.buyin) {
    return res.boom.badData('Missing param');
  }

  var tableId = req.params.tableId;
  var session = req.params.__session;

  // Generate a game token
  var gameToken = uuid.v4();

  // Edit session with
  // the game information
  session.game = {
    tableId: tableId,
    token: gameToken
  };

  return session.save(function (err) {
    if (err) {
      return res.boom.badRequest(err);
    }

    return Table.update(
      { _id: tableId },
      {
        $push: {
          sittingPlayers: {
            userId: session.userId,
            money: payload.buyin
          }
        }
      }, function (err) {
        if (err) {
          return res.boom.badRequest(err);
        }

        // Send 201 and the game token
        // so the client can auth the game websocket
        // that he is going to create
        return res.status(201).json({
          gameToken: gameToken
        });
      }
    );
  });
});

function removeUserFromTable (tableId, userId, cb) {
  return Table.update(
    { _id: tableId },
    {
      $pull: {
        sittingPlayers: {
          userId: userId
        }
      }
    },
    cb
  );
}

// Leave the current game
router.delete('/game', util.isAuthenticated, function (req, res) {
  var session = req.params.__session;
  var tableId = session.game.tableId;

  if (!session.game || !session.game.tableId || !session.game.token) {
    return res.boom.badData('Player is not playing any game');
  }

  return removeUserFromTable(tableId, session.userId, function (err) {
    if (err) {
      return res.boom.badRequest(err);
    }

    session.game = null;

    return session.save(function (err) {
      if (err) {
        return res.boom.badRequest(err);
      }

      return res.status(204).end();
    });
  });
});

router.delete('/', util.isAuthenticated, function (req, res) {
  var session = req.params.__session;
  var tableId = session.game.tableId;

  // Check if the user is currently playing
  // any game if he is remove him from the
  // game
  var removeIfUserPlaying = function (cb) {
    if (session.game && session.game.tableId && session.game.token) {
      return removeUserFromTable(tableId, session.userId, cb);
    }

    return cb();
  };

  return removeIfUserPlaying(function (err) {
    if (err) {
      return res.boom.badRequest(err);
    }

    return session.remove(function (err) {
      if (err) {
        return res.boom.badRequest(err);
      }

      return res.status(204).end();
    });
  });
});

module.exports = router;
