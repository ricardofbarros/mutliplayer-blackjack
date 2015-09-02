import {config} from '../store/cookies';
import axios from 'axios';
import url from 'url';
import apiCallWrapper from './common/apiCallWrapper';

async function createNew (accessToken, name, maxBuyIn, playersLimit, numberOfDecks, buyin) {
  let promise = axios.post.bind(axios, url.resolve(config.baseUrl, '/api/table'), ...arguments);

  return await apiCallWrapper(promise);
}

async function getAll (accessToken) {
  let promise = axios.get.bind(axios, url.resolve(config.baseUrl, '/api/table'), {
    params: {
      accessToken
    }
  });

  return await apiCallWrapper(promise);
}

export default { createNew, getAll };
