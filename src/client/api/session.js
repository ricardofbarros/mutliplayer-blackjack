import {config} from '../store/cookies';
import axios from 'axios';
import url from 'url';
import apiCallWrapper from './common/apiCallWrapper';

const MISSING_PARAMS = config.apiMsgState.misc.MISSING_PARAMS;
const USER_NOT_FOUND = config.apiMsgState.session.USER_NOT_FOUND;

async function signIn (username, password) {
  let promise = axios.post.bind(axios, url.resolve(config.baseUrl, '/api/session'), {
    username,
    password
  });

  return await apiCallWrapper(promise, [MISSING_PARAMS, USER_NOT_FOUND]);
}

async function signOut (accessToken) {
  let promise = axios.delete.bind(axios, url.resolve(config.baseUrl, '/api/session'), {
    params: {
      accessToken
    }
  });

  return await apiCallWrapper(promise);
}

async function getUserInfo (accessToken) {
  let promise = axios.get.bind(axios, url.resolve(config.baseUrl, '/api/session/user'), {
    params: {
      accessToken
    }
  });

  return await apiCallWrapper(promise);
}

async function joinGame (accessToken, tableId) {
  let promise = axios.put.bind(axios, url.resolve(config.baseUrl, '/api/session/game/' + tableId), {
    params: {
      accessToken
    }
  });

  return await apiCallWrapper(promise);
}

async function leaveGame (accessToken) {
  let promise = axios.delete.bind(axios, url.resolve(config.baseUrl, '/api/session/game'), {
    params: {
      accessToken
    }
  });

  return await apiCallWrapper(promise);
}

export default { signIn, signOut, getUserInfo, joinGame, leaveGame };
