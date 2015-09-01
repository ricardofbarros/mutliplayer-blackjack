import {client as config} from 'config';
import axios from 'axios';
import url from 'url';

function createNew (accessToken, name, moneyLimit, playersLimit, numberOfDecks, buyin) {
  return axios.post(url.resolve(config.baseUrl, '/api/table'), ...arguments);
}

function getAll (accessToken) {
  return axios.get(url.resolve(config.baseUrl, '/api/table'), {
    params: {
      accessToken
    }
  });
}

export default { createNew, getAll };
