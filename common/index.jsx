import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Perf from 'react-addons-perf';
import { createStore, applyMiddleware } from 'redux';
import RootReducer from './reducers';
import { Root } from 'components';
import { Routing, history } from './routing';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import notificationsSaga from './sagas/notifications';

// application styles
import 'assets/styles/etherwallet-master.less';

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  let sagaApplied = applyMiddleware(sagaMiddleware);
  let store;
  let middleware;

  if (process.env.NODE_ENV !== 'production') {
    window.Perf = Perf;
    sagaApplied = composeWithDevTools(sagaApplied);
    const logger = createLogger({
      collapsed: true
    });
    middleware = applyMiddleware(routerMiddleware(history), logger);
  } else {
    middleware = applyMiddleware(routerMiddleware(history));
  }

  store = createStore(RootReducer, sagaApplied, middleware);
  sagaMiddleware.run(notificationsSaga);
  return store;
};

const renderRoot = Root => {
  let store = configureStore();
  let syncedHistory = syncHistoryWithStore(history, store);
  render(
    <Root
      key={Math.random()}
      routes={Routing}
      history={syncedHistory}
      store={store}
    />,
    document.getElementById('app')
  );
};

renderRoot(Root);

if (module.hot) {
  module.hot.accept();
}
