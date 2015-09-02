var validation = {};

// Regex strings
var alphanumeric = '^[a-zA-Z0-9_]*$';

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

  var paramsRequired = [
    'name',
    'moneyLimit',
    'playersLimit',
    'numberOfDecks',
    'buyin'
  ];

//   {
//     "name": "test",
//     "moneyLimit": "1000",
//     "playersLimit": "6",
//     "numberOfDecks": "6",
//     "buyin": "500"
// }

  if (!checkParamsRequired(payload, paramsRequired)) {
    return MISSING_PARAMS;
  }

  return false;
};

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

module.exports = validation;
