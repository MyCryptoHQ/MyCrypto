import {
  saveState,
  loadState,
  loadStatePropertyOrEmptyObject
} from 'utils/localStorage';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
import { INITIAL_STATE as configInitialState } from 'reducers/config';
import { INITIAL_STATE as customTokensInitialState } from 'reducers/customTokens';
import { INITIAL_STATE as swapInitialState } from 'reducers/swap';
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

  const persistedInitialState = {
    config: {
      ...configInitialState,
      ...loadStatePropertyOrEmptyObject('config')
    },
    customTokens: (loadState() || {}).customTokens || customTokensInitialState,
    // ONLY LOAD SWAP STATE FROM LOCAL STORAGE IF STEP WAS 3
    swap:
      loadStatePropertyOrEmptyObject('swap').step === 3
        ? {
            ...swapInitialState,
            ...loadStatePropertyOrEmptyObject('swap')
          }
        : { ...swapInitialState }
  };

  store = createStore(RootReducer, persistedInitialState, middleware);

  // Add all of the sagas to the middleware
  Object.keys(sagas).forEach(saga => {
    sagaMiddleware.run(sagas[saga]);
  });

  store.subscribe(
    throttle(() => {
      saveState({
        config: {
          languageSelection: store.getState().config.languageSelection
        },
        swap: store.getState().swap,
        customTokens: store.getState().customTokens
      });
    }),
    1000
  );
  return store;
};

export const store = configureStore();
