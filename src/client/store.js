import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promiseMiddleware from 'redux-promise';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
)(createStore);

function configureStore (initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

const store = configureStore({});

export default store;
