import { APP_HYDRATE_TABLES, ADD_TABLE, REMOVE_TABLE, UPDATE_TABLE } from '../actions/tables';
import { OrderedMap } from 'immutable';

export default function tables (state = 0, action) {
  if (action && action.error) {
    return state;
  }

  switch (action.type) {
    case APP_HYDRATE_TABLES:
      let hydrateData = {};
      action.payload.forEach(function (t) {
        hydrateData[t.id] = t;
      });

      return OrderedMap(hydrateData);
    case ADD_TABLE:
      return state.set(action.payload.id, action.payload);
    case REMOVE_TABLE:
      return state.delete(action.payload.id);
    case UPDATE_TABLE:
      return state.update(action.payload.id, () => {
        return action.payload;
      });
    default:
      return state;
  }
}
