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
import ensSaga from './sagas/ens';
import walletSaga from './sagas/wallet';
import { initialState as configInitialState } from 'reducers/config';
import throttle from 'lodash/throttle';
// application styles
import 'assets/styles/etherwallet-master.less';
import { saveState, loadStatePropertyOrEmptyObject } from 'utils/localStorage';

let store;

const configureStore = () => {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;

  if (process.env.NODE_ENV !== 'production') {
    window.Perf = Perf;
    middleware = composeWithDevTools(
      applyMiddleware(sagaMiddleware, logger, routerMiddleware(history))
    );
  } else {
    middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history));
  }

  const persistedConfigInitialState = {
    config: {
      ...configInitialState,
      ...loadStatePropertyOrEmptyObject('config')
    }
  };

  const completePersistedInitialState = {
    ...persistedConfigInitialState
  };

  store = createStore(RootReducer, completePersistedInitialState, middleware);
  sagaMiddleware.run(notificationsSaga);
  sagaMiddleware.run(ensSaga);
  sagaMiddleware.run(walletSaga);

  store.subscribe(
    throttle(() => {
      saveState({
        config: {
          languageSelection: store.getState().config.languageSelection
        }
      });
    }),
    1000
  );
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
  module.hot.accept('reducers/index', () =>
    store.replaceReducer(require('reducers/index').default)
  );
}
