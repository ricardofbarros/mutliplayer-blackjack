import { combineReducers } from 'redux';
import user from './user';
import session from './session';
import tables from './tables';

const reducers = combineReducers({
  user,
  session,
  tables
});

export default reducers;
