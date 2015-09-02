import { combineReducers } from 'redux';
import session from './session';
import tables from './tables';
import sessionExpired from './sessionExpired';

const reducers = combineReducers({
  session,
  tables,
  sessionExpired
});

export default reducers;
