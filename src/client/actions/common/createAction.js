import TOKEN_EXPIRED from '../../api/common/tokenExpired';

export default function createAction (type, actionCreator, mapFn) {
  return async (...a) => {
    let action = {
      type
    };

    let result = await actionCreator.apply(null, a);
    action.payload = result.data;

    if (result.error) {
      if (result.data && result.data.message && result.data.message === TOKEN_EXPIRED) {
        action.meta = {
          tokenExpired: true
        };
      }
      action.error = true;
    } else if (!result.error && typeof mapFn === 'function') {
      let mapResult = [action.payload].map(mapFn);
      action.payload = mapResult[0];
    }

    return action;
  };
}
