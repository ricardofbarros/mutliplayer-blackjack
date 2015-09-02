import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import promiseMiddleware from 'redux-promise';
import { initialState as sessionInitialState } from '../reducers/session';
import { initialState as tablesInitialState } from '../reducers/tables';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
)(createStore);

function configureStore (initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

let initialState = {
  session: sessionInitialState,
  tables: tablesInitialState,
  sessionExpired: false
};

const store = configureStore(initialState);

export default store;
