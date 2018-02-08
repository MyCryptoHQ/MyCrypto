import throttle from 'lodash/throttle';
import { routerMiddleware } from 'react-router-redux';
import { State as ConfigState, INITIAL_STATE as configInitialState } from 'reducers/config';
import {
  State as CustomTokenState,
  INITIAL_STATE as customTokensInitialState
} from 'reducers/customTokens';
import { State as SwapState, INITIAL_STATE as swapInitialState } from 'reducers/swap';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { loadStatePropertyOrEmptyObject, saveState } from 'utils/localStorage';
import RootReducer, { AppState } from './reducers';
import { getNodeConfigFromId } from 'utils/node';
import { getNetworkConfigFromId } from 'utils/network';
import { dedupeCustomTokens } from 'utils/tokens';
import sagas from './sagas';

const configureStore = () => {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;
  let store;

  if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(
      applyMiddleware(sagaMiddleware, logger, routerMiddleware(history as any))
    );
  } else {
    middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history as any));
  }

  const localSwapState = loadStatePropertyOrEmptyObject<SwapState>('swap');
  const swapState =
    localSwapState && localSwapState.step === 3
      ? {
          ...swapInitialState,
          ...localSwapState
        }
      : { ...swapInitialState };

  const savedConfigState = loadStatePropertyOrEmptyObject<ConfigState>('config');

  // If they have a saved node, make sure we assign that too. The node selected
  // isn't serializable, so we have to assign it here.
  if (savedConfigState && savedConfigState.nodeSelection) {
    const savedNode = getNodeConfigFromId(
      savedConfigState.nodeSelection,
      savedConfigState.customNodes
    );
    // If we couldn't find it, revert to defaults
    if (savedNode) {
      savedConfigState.node = savedNode;
      const network = getNetworkConfigFromId(savedNode.network, savedConfigState.customNetworks);
      if (network) {
        savedConfigState.network = network;
      }
    } else {
      savedConfigState.nodeSelection = configInitialState.nodeSelection;
    }
  }

  // Dedupe custom tokens initially
  const savedCustomTokensState =
    loadStatePropertyOrEmptyObject<CustomTokenState>('customTokens') || customTokensInitialState;
  const initialNetwork =
    (savedConfigState && savedConfigState.network) || configInitialState.network;
  const customTokens = dedupeCustomTokens(initialNetwork.tokens, savedCustomTokensState);

  const persistedInitialState = {
    config: {
      ...configInitialState,
      ...savedConfigState
    },
    customTokens,
    // ONLY LOAD SWAP STATE FROM LOCAL STORAGE IF STEP WAS 3
    swap: swapState
  };
  // if 'web3' has persisted as node selection, reset to app default
  // necessary because web3 is only initialized as a node upon MetaMask / Mist unlock
  if (persistedInitialState.config.nodeSelection === 'web3') {
    persistedInitialState.config.nodeSelection = configInitialState.nodeSelection;
  }

  store = createStore(RootReducer, persistedInitialState, middleware);

  // Add all of the sagas to the middleware
  Object.keys(sagas).forEach(saga => {
    sagaMiddleware.run(sagas[saga]);
  });

  store.subscribe(
    throttle(() => {
      const state: AppState = store.getState();
      saveState({
        config: {
          nodeSelection: state.config.nodeSelection,
          languageSelection: state.config.languageSelection,
          customNodes: state.config.customNodes,
          customNetworks: state.config.customNetworks
        },
        swap: {
          ...state.swap,
          options: {
            byId: {},
            allIds: []
          },
          bityRates: {
            byId: {},
            allIds: []
          },
          shapeshiftRates: {
            byId: {},
            allIds: []
          }
        },
        customTokens: state.customTokens
      });
    }, 50)
  );

  return store;
};

export const configuredStore = configureStore();
