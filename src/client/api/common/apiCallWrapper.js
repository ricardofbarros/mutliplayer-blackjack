export default async function apiCallWrapper (promise, validErrors = []) {
  let result;

  try {
    result = await promise();
  } catch (e) {
    if (!e.data || !e.data.message) {
      throw e;
    }

    if (validErrors.indexOf(e.data.message) > -1) {
      result = e;
      result.error = true;
    } else {
      throw e;
    }
  }

  return result;
}
