import { combineReducers } from 'redux';
import session from './session';
import tables from './tables';

const reducers = combineReducers({
  session,
  tables
});

export default reducers;
