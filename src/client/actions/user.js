import { createAction } from 'redux-actions';

export const APP_HYDRATE_USER = 'APP_HYDRATE_USER';

let hydrateUser = createAction(APP_HYDRATE_USER, (user) => {
  return user;
});

export default { hydrateUser };
