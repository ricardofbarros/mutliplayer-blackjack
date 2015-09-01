import {client as config} from 'config';
import axios from 'axios';
import url from 'url';

function signIn (username, password) {
  return axios.post(url.resolve(config.baseUrl, '/api/session'), {
    username,
    password
  });
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
