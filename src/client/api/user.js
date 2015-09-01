import config from 'clientconfig';
import axios from 'axios';
import url from 'url';

const MISSING_PARAMS = config.apiMsgState.user.MISSING_PARAMS;
const USER_EXISTS = config.apiMsgState.user.USER_EXISTS;
const PASSWORD_MATCH = config.apiMsgState.user.PASSWORD_MATCH;

async function createNew (username, password, confirmPassword) {
  let result;
  try {
    result = await axios.post(url.resolve(config.baseUrl, '/api/user'), {
      username,
      password,
      confirmPassword
    });
  } catch (e) {
    if (!e.data || !e.data.message) {
      throw e;
    }

    switch (e.data.message) {
      case MISSING_PARAMS:
      case USER_EXISTS:
      case PASSWORD_MATCH:
        result = e;
        result.error = true;
        break;
      default:
        throw e;
    }
  }

  return result;
}

export default { createNew };
