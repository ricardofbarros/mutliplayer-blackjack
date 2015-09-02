import { GET_USER_INFO } from '../actions/session';

export default function session (state = 0, action) {
  if (action && action.error) {
    return state;
  }

  switch (action.type) {
    case GET_USER_INFO:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
