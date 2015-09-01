import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import promiseMiddleware from 'redux-promise';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
)(createStore);

function configureStore (initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

let initialState = {
  user: {
    accountBalance: '',
    id: '',
    username: ''
  },
  session: {
    accessToken: '',
    gameToken: ''
  },
  tables: []
};

const store = configureStore(initialState);

export default store;
