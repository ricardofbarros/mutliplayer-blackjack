import { APP_HYDRATE_SESSION } from '../actions/session';

export default function session (state = 0, action) {
  switch (action.type) {
    case APP_HYDRATE_SESSION:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
