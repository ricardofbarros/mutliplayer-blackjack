import SessionApi from '../api/session';
import createAction from './common/createAction';

export const GET_USER_INFO = 'GET_USER_INFO';
export const LOGIN = 'LOGIN';

export let getUserInfo = createAction(GET_USER_INFO, async (accessToken) => {
  return await SessionApi.getUserInfo(accessToken);
}, (obj) => { return obj.session; });

export let login = createAction(LOGIN, async (user, pass) => {
  return await SessionApi.signIn(user, pass);
});

export default { getUserInfo, login };
