import createAction from './common/createAction';
import TableApi from '../api/table';

export const APP_HYDRATE_TABLES = 'APP_HYDRATE_TABLES';
export const CREATE_TABLE = 'CREATE_TABLE';
export const ADD_TABLE = 'ADD_TABLE';
export const REMOVE_TABLE = 'DELETE_TABLE';
export const UPDATE_TABLE = 'UPDATE_TABLE';

let hydrateTables = createAction(APP_HYDRATE_TABLES, async (accessToken) => {
  return await TableApi.getAll(accessToken);
}, (obj) => { return obj.tables; });

// Args: accessToken, {name, moneyLimit, playersLimit, numberOfDecks, buyin}
let createTable = createAction(CREATE_TABLE, async (accessToken, tableObj) => {
  return await TableApi.createNew(accessToken, ...tableObj);
});

let addTable = createAction(ADD_TABLE, (data) => {
  return {
    data
  };
});

let removeTable = createAction(REMOVE_TABLE, (data) => {
  return {
    data
  };
});

let updateTable = createAction(UPDATE_TABLE, (data) => {
  return {
    data
  };
});

export default { hydrateTables, createTable, addTable, removeTable, updateTable };
