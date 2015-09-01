import Cookies from 'cookies-js';

// client config
export const config = JSON.parse(Cookies.get('config'));

export default Cookies;
