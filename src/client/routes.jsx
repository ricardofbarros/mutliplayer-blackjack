import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import App from './containers/app';
import LoginPage from './containers/loginPage';
import SignUpPage from './containers/signUpPage';
import LobbyPage from './containers/lobbyPage';

const routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={LobbyPage} />
    <Route name='login' handler={LoginPage} />
    <Route name='sign-up' handler={SignUpPage} />
  </Route>
);

export default routes;
