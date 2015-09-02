import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import promiseMiddleware from 'redux-promise';
import { OrderedMap } from 'immutable';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
)(createStore);

function configureStore (initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

let initialState = {
  session: {
    id: '',
    username: '',
    accountBalance: '',
    accessToken: '',
    game: {
      tableId: '',
      token: ''
    }
  },
  tables: OrderedMap(),
  sessionExpired: false
};

const store = configureStore(initialState);

export default store;
