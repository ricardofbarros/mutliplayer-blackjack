import 'bootstrap-webpack';
import 'regenerator/runtime';
import 'babel-core/polyfill';
import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import reduxStore from './store/redux';
import '../public/css/style.css';
import 'toastr/build/toastr.css';

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <Provider store={reduxStore}>
      {() => <Handler routerState={state} />}
    </Provider>,
    document.getElementById('content')
  );
});
