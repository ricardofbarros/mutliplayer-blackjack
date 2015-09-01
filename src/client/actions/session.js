import SessionApi from '../api/session';
import { createAction } from 'redux-actions';

export const GET_USER_INFO = 'GET_USER_INFO';
export const APP_HYDRATE_SESSION = 'APP_HYDRATE_SESSION';

let getUserInfo = createAction(GET_USER_INFO, async (accessToken) => {
  let result = await SessionApi.getUserInfo(accessToken);
  return result.data;
});

let hydrateSession = createAction(APP_HYDRATE_SESSION, (session) => {
  return session;
});

export default { getUserInfo, hydrateSession };
