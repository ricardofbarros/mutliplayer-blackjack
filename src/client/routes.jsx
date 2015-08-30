import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import App from './app';
import LoginPage from './components/login/loginPage';
import SignUpPage from './components/signUp/signUpPage';

const routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={LoginPage} />
    <Route name='sign-up' handler={SignUpPage} />
  </Route>
);

export default routes;
