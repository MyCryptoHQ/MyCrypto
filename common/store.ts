import throttle from 'lodash/throttle';
import Perf from 'react-addons-perf';
import { routerMiddleware } from 'react-router-redux';
import { INITIAL_STATE as configInitialState } from 'reducers/config';
import { INITIAL_STATE as customTokensInitialState } from 'reducers/customTokens';
import { INITIAL_STATE as swapInitialState } from 'reducers/swap';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {
  loadState,
  loadStatePropertyOrEmptyObject,
  saveState
} from 'utils/localStorage';
import RootReducer from './reducers';
import sagas from './sagas';

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
          nodeSelection: store.getState().config.nodeSelection,
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
