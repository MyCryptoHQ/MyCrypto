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
import { State as CustomTokenState } from './reducers/customTokens';
import { State as SwapState } from './reducers/swap';

import sagas from './sagas';

interface MyWindow extends Window {
  Perf: Perf;
}
const configureStore = () => {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;
  let store;

  if (process.env.NODE_ENV !== 'production') {
    (window as MyWindow).Perf = Perf;
    middleware = composeWithDevTools(
      applyMiddleware(sagaMiddleware, logger, routerMiddleware(history as any))
    );
  } else {
    middleware = applyMiddleware(
      sagaMiddleware,
      routerMiddleware(history as any)
    );
  }

  const localSwapState = loadStatePropertyOrEmptyObject<SwapState>('swap');
  const swapState =
    localSwapState && localSwapState.step === 3
      ? {
          ...swapInitialState,
          ...localSwapState
        }
      : { ...swapInitialState };

  const localCustomTokens = loadStatePropertyOrEmptyObject<CustomTokenState>(
    'customTokens'
  );

  const persistedInitialState = {
    config: {
      ...configInitialState,
      ...loadStatePropertyOrEmptyObject('config')
    },
    customTokens: localCustomTokens || customTokensInitialState,
    // ONLY LOAD SWAP STATE FROM LOCAL STORAGE IF STEP WAS 3
    swap: swapState
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

export const configuredStore = configureStore();
