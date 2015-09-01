import {config} from '../cookies';
import axios from 'axios';
import url from 'url';
import apiCallWrapper from './common/apiCallWrapper';

const MISSING_PARAMS = config.apiMsgState.misc.MISSING_PARAMS;
const USER_EXISTS = config.apiMsgState.user.USER_EXISTS;
const PASSWORD_MATCH = config.apiMsgState.user.PASSWORD_MATCH;

async function createNew (username, password, confirmPassword) {
  let promise = axios.post.bind(axios, url.resolve(config.baseUrl, '/api/user'), {
    username,
    password,
    confirmPassword
  });

  return await apiCallWrapper(promise, [MISSING_PARAMS, USER_EXISTS, PASSWORD_MATCH]);
}

export default { createNew };
