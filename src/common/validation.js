var validation = {};

validation.user = function (apiMsgState, payload) {
  // Constants
  var MISSING_PARAMS = apiMsgState.misc.MISSING_PARAMS;
  var PASSWORD_MATCH = apiMsgState.user.PASSWORD_MATCH;

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
