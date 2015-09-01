import {client as config} from 'config';
import axios from 'axios';
import url from 'url';

function createNewUser (username, password, confirmPassword) {
  return axios.post(url.resolve(config.baseUrl, '/api/user'), {
    username,
    password,
    confirmPassword
  });
}

function signIn (username, password) {
  return axios.post(url.resolve(config.baseUrl, '/api/session'), {
    username,
    password
  });
}

function aboutMe (accessToken) {
  return axios.get(url.resolve(config.baseUrl, '/api/session/user'), {
    params: {
      accessToken
    }
  });
}

export default { createNewUser, signIn, aboutMe };
