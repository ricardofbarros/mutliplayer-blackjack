var validation = {};

// Regex strings
var alphanumeric = '^[a-zA-Z0-9_]*$';

// Used to check the required params
function checkParamsRequired (payload, paramsRequired) {
  var paramsKeys = Object.keys(payload);

  // Check if all params required
  // are in the payload
  // If not return an error
  return paramsRequired.every(function (param) {
    if (!payload[param]) {
      return false;
    }

    return (paramsKeys.indexOf(param) > -1);
  });
}

validation.user = function (apiMsgState, payload) {
  // Constants
  var MISSING_PARAMS = apiMsgState.misc.MISSING_PARAMS;
  var PASSWORD_MATCH = apiMsgState.user.PASSWORD_MATCH;
  var INVALID_USER_FIELD = apiMsgState.user.INVALID_USER_FIELD;
  var INVALID_PASS_FIELD = apiMsgState.user.INVALID_PASS_FIELD;

  var paramsRequired = [
    'username',
    'password',
    'confirmPassword'
  ];

  if (!checkParamsRequired(payload, paramsRequired)) {
    return MISSING_PARAMS;
  }

  // Sane check
  if (payload.password !== payload.confirmPassword) {
    return PASSWORD_MATCH;
  }

  var re = new RegExp(alphanumeric, 'g');
  if (!re.test(payload.username)) {
    return INVALID_USER_FIELD;
  }
  if (!re.test(payload.password)) {
    return INVALID_PASS_FIELD;
  }

  return false;
};

validation.table = function (apiMsgState, payload) {
  // Constants
  var MISSING_PARAMS = apiMsgState.misc.MISSING_PARAMS;
  var INVALID_NAME_FIELD = apiMsgState.table.INVALID_NAME_FIELD;
  var MAX_BUYIN = apiMsgState.table.MAX_BUYIN;
  var BUYIN = apiMsgState.table.BUYIN;
  var NUMBER_DECKS = apiMsgState.table.NUMBER_DECKS;
  var PLAYERS_LIMIT = apiMsgState.table.PLAYERS_LIMIT;

  var paramsRequired = [
    'name',
    'maxBuyIn',
    'playersLimit',
    'numberOfDecks',
    'buyin'
  ];

  if (!checkParamsRequired(payload, paramsRequired)) {
    return MISSING_PARAMS;
  }

  var re = new RegExp(alphanumeric, 'g');
  if (!re.test(payload.name)) {
    return INVALID_NAME_FIELD;
  }

  if (payload.moneyLimit < 1 || payload.moneyLimit > 1000) {
    return MAX_BUYIN;
  }

  if (payload.buyin > payload.moneyLimit) {
    return BUYIN;
  }

  if (payload.numberOfDecks < 1 || payload.numberOfDecks > 6) {
    return NUMBER_DECKS;
  }

  if (payload.playersLimit < 1 || payload.playersLimit > 4) {
    return PLAYERS_LIMIT;
  }

  return false;
};

module.exports = validation;
