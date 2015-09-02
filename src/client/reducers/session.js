import { GET_USER_INFO, LOGOUT } from '../actions/session';

export const initialState = {
  id: '',
  username: '',
  accountBalance: '',
  accessToken: '',
  game: {
    tableId: '',
    token: ''
  }
};

export default function session (state = initialState, action) {
  if (action && action.error) {
    return state;
  }

  switch (action.type) {
    case GET_USER_INFO:
      return Object.assign({}, state, action.payload);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
