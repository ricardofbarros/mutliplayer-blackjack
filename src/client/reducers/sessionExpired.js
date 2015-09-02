export default function sessionExpired (state = false, action) {
  if (action && action.error && action.meta && action.meta.tokenExpired) {
    return true;
  }

  return state;
}
