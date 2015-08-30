import 'bootstrap-webpack';
import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import { createStore } from 'redux';
import reducers from './reducers';
import '../public/css/style.css';

function configureStore (initialState) {
  return createStore(reducers, initialState);
}

const store = configureStore();

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <Provider store={store}>
      {() => <Handler routerState={state} />}
    </Provider>,
    document.getElementById('content')
  );
});
