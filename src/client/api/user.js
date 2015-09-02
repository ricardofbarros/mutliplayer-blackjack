import {config} from '../store/cookies';
import axios from 'axios';
import url from 'url';
import apiCallWrapper from './common/apiCallWrapper';

const MISSING_PARAMS = config.apiMsgState.misc.MISSING_PARAMS;
const USER_EXISTS = config.apiMsgState.user.USER_EXISTS;
const PASSWORD_MATCH = config.apiMsgState.user.PASSWORD_MATCH;
const INVALID_USER_FIELD = config.apiMsgState.user.INVALID_USER_FIELD;
const INVALID_PASS_FIELD = config.apiMsgState.user.INVALID_PASS_FIELD;

async function createNew (username, password, confirmPassword) {
  let promise = axios.post.bind(axios, url.resolve(config.baseUrl, '/api/user'), {
    username,
    password,
    confirmPassword
  });

  return await apiCallWrapper(promise, [MISSING_PARAMS, USER_EXISTS, PASSWORD_MATCH, INVALID_USER_FIELD, INVALID_PASS_FIELD]);
}

export default { createNew };
