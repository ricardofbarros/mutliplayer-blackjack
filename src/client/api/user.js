import {client as config} from 'config';
import axios from 'axios';
import url from 'url';

function createNew (username, password, confirmPassword) {
  return axios.post(url.resolve(config.baseUrl, '/api/user'), {
    username,
    password,
    confirmPassword
  });
}

export default { createNew };
