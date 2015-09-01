import { APP_HYDRATE_USER } from '../actions/user';

export default function user (state = 0, action) {
  switch (action.type) {
    case APP_HYDRATE_USER:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
