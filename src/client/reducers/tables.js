import { APP_HYDRATE_TABLES } from '../actions/tables';

export default function tables (state = 0, action) {
  switch (action.type) {
    case APP_HYDRATE_TABLES:
      return Object.assign([], state, action.payload);
    default:
      return state;
  }
}
