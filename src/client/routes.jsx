import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import App from './app';
import Login from './containers/login';

const routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={Login} />
  </Route>
);

export default routes;
