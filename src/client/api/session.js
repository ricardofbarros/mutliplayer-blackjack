import config from 'clientconfig';
import axios from 'axios';
import url from 'url';

const MISSING_PARAMS = config.apiMsgState.misc.MISSING_PARAMS;
const USER_NOT_FOUND = config.apiMsgState.session.USER_NOT_FOUND;

async function signIn (username, password) {
  let result;

  try {
    result = await axios.post(url.resolve(config.baseUrl, '/api/session'), {
      username,
      password
    });
  } catch (e) {
    if (!e.data || !e.data.message) {
      throw e;
    }

    switch (e.data.message) {
      case MISSING_PARAMS:
      case USER_NOT_FOUND:
        result = e;
        result.error = true;
        break;
      default:
        throw e;
    }
  }

  return result;
}

function signOut (accessToken) {
  return axios.delete(url.resolve(config.baseUrl, '/api/session'), {
    params: {
      accessToken
    }
  });
}

function getUserInfo (accessToken) {
  return axios.get(url.resolve(config.baseUrl, '/api/session/user'), {
    params: {
      accessToken
    }
  });
}

function getGameInfo (accessToken) {
  return axios.get(url.resolve(config.baseUrl, '/api/session/game'), {
    params: {
      accessToken
    }
  });
}

function startNewGame (accessToken, tableId) {
  return axios.put(url.resolve(config.baseUrl, '/api/session/game/' + tableId), {
    params: {
      accessToken
    }
  });
}

function leaveGame (accessToken) {
  return axios.delete(url.resolve(config.baseUrl, '/api/session/game'), {
    params: {
      accessToken
    }
  });
}

export default { signIn, signOut, getUserInfo, getGameInfo, startNewGame, leaveGame };
