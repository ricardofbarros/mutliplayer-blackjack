// Dependencies
var express = require('express');
var util = require('../util');
var User = require('../models/User');
var Session = require('../models/Session');
var Table = require('../models/Table');
var uuid = require('node-uuid');
var config = require('../../config');
var lobbySocket = require('../sockets/lobby')();
var router = express.Router();

// Constants
var MISSING_PARAMS = config.apiMsgState.misc.MISSING_PARAMS;
var USER_NOT_FOUND = config.apiMsgState.session.USER_NOT_FOUND;
var LOGIN_SUCCESS = config.apiMsgState.session.LOGIN_SUCCESS;
var ALREADY_PLAYING = config.apiMsgState.session.ALREADY_PLAYING;

// Route mount path: /api/session

// Sign in
router.post('/', function (req, res) {
  var payload = req.body;

  if (!payload.username || !payload.password) {
    return res.boom.badData(MISSING_PARAMS);
  }

  return User.findOne({
    username: payload.username,
    password: util.hashPassword(payload.password)
  }, function (err, user) {
    if (err) {
      return res.boom.badRequest(err);
    }

    if (!user) {
      return res.boom.badData(USER_NOT_FOUND);
    }

    var accessToken = uuid.v4();

    return Session.findOne({ userId: user._id }, function (err, session) {
      if (err) {
        return res.boom.badRequest(err);
      }

      if (!session) {
        session = new Session({
          userId: user._id
        });
      }
      session.accessToken = accessToken;

      return session.save(function (err) {
        if (err) {
          return res.boom.badRequest(err);
        }

        return res.status(201).json({
          accessToken: accessToken,
          message: LOGIN_SUCCESS
        });
      });
    });
  });
});

// Get info about himself
router.get('/user', util.isAuthenticated, function (req, res) {
  var userId = req.params.__session.userId;
  var session = req.params.__session;

  return User.findById(userId, function (err, user) {
    if (err || !user) {
      return res.boom.badRequest(err || 'Something went wrong.');
    }

    // User isn't playing currently
    if (!session.game || !session.game.tableId || !session.game.token) {
      return res.status(200).json({
        session: util.sessionInterfaceMap(session, user)
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
        return res.boom.resourceGone('Table doesn\'t exist anymore');
      }

      return res.status(200).json({
        session: util.sessionInterfaceMap(session, user)
      });
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

  // User is already playing
  if (session.game.tableId) {
    return res.boom.badData(ALREADY_PLAYING);
  }

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

    return Table.findById(tableId, function (err, table) {
      if (err) {
        return res.boom.badRequest(err);
      }

      if (!table) {
        return res.boom.resourceGone('Table doesn\'t exist anymore');
      }

      // Try to add the player
      var numberOfPlayer = table.sittingPlayers.length;
      if (table.tableLimit.players <= numberOfPlayer) {
        return res.boom.badRequest('Table players limit reached');
      }

      table.sittingPlayers.push(session.game);

      return table.save(function (err) {
        if (err) {
          return res.boom.badRequest(err);
        }

        lobbySocket.updateTable(util.tableInterfaceMap(table));

        // Send 201 and the game token
        // so the client can auth the game websocket
        // that he is going to create
        return res.status(201).json({
          gameToken: gameToken
        });
      });
    });
  });
});

function removeUserFromTable (tableId, userId, cb) {
  return Table.findById(tableId, function (err, table) {
    if (err) {
      return cb(err);
    }

    if (!table) {
      return cb();
    }

    if (table.sittingPlayers.length === 1) {
      if (table.sittingPlayers.userId !== userId) {
        return cb(new Error('Something bad happened'));
      }

      return table.remove(function (err) {
        if (err) {
          return cb(err);
        }

        lobbySocket.deleteTable(util.tableInterfaceMap(table));
        return cb();
      });
    }

    table.sittingPlayers.filter(function (players) {
      return players.userId !== userId;
    });

    return table.save(function (err) {
      if (err) {
        return cb(err);
      }

      lobbySocket.updateTable(util.tableInterfaceMap(table));
      return cb();
    });
  });
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
