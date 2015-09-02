import { APP_HYDRATE_TABLES, ADD_TABLE, REMOVE_TABLE, UPDATE_TABLE } from '../actions/tables';

export default function tables (state = 0, action) {
  if (typeof state !== 'object') {
    return state;
  }

  switch (action.type) {
    case APP_HYDRATE_TABLES:
      let hydrateData = new Map();
      action.payload.forEach(function (t) {
        hydrateData.set(t.id, t);
      });

      return hydrateData;
    case ADD_TABLE:
      let data = [];
      state.forEach(function (d) {
        data.push(d);
      });
      data.push(action.payload);
      return data;
    case REMOVE_TABLE:

    case UPDATE_TABLE:
    default:
      return state;
  }
}
