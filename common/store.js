import { saveState, loadStatePropertyOrEmptyObject } from 'utils/localStorage';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import notificationsSaga from './sagas/notifications';
import ensSaga from './sagas/ens';
import walletSaga from './sagas/wallet';
import bitySaga from './sagas/bity';
import { initialState as configInitialState } from 'reducers/config';
import throttle from 'lodash/throttle';
import { composeWithDevTools } from 'redux-devtools-extension';
import Perf from 'react-addons-perf';
import { createStore, applyMiddleware } from 'redux';
import RootReducer from './reducers';
import { routerMiddleware } from 'react-router-redux';

const configureStore = () => {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;
  let store;

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
  sagaMiddleware.run(bitySaga);

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

export const store = configureStore();
