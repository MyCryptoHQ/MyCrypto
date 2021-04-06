import { configureStore, DeepPartial } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { analyticsMiddleware } from '@services/Analytics';
import { pollStart } from '@services/Polling';
import { updateAccounts } from '@store';
import { IS_DEV } from '@utils';

import {
  connectToHDWallet,
  getAccounts,
  onConnectionSuccess,
  processAccountsQueue,
  scanMoreAddresses
} from './hdWallet.slice';
import { REDUX_PERSIST_ACTION_TYPES } from './persist.config';
import rootReducer, { AppState } from './root.reducer';
import rootSaga from './sagas';
import { serializeLegacyMiddleware } from './serialize.middleware';

export default function createStore(initialState?: DeepPartial<AppState>) {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => [
      serializeLegacyMiddleware,
      ...getDefaultMiddleware({
        thunk: false, // MYC uses sagas
        serializableCheck: {
          ignoredActions: [
            // ignore redux-persist actions during serialize check.
            // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
            ...REDUX_PERSIST_ACTION_TYPES,
            // ignore updateAccounts to avoid errors for transaction gasPrice, gasLimit, value etc
            // @todo: Redux solve once we have selectors to deserialize.
            updateAccounts.type,
            // ignore pollStart to avoid errors with the methods passed in the payload of the action
            pollStart.type,
            // ignore onConnectionSuccess to avoid errors with the wallet session passed in the payload of the action
            connectToHDWallet.type,
            onConnectionSuccess.type,
            getAccounts.type,
            scanMoreAddresses.type,
            processAccountsQueue.type
          ]
        }
      }),
      sagaMiddleware,
      analyticsMiddleware,
      // Logger MUST be last in chain.
      // https://github.com/LogRocket/redux-logger#usage
      ...(IS_DEV ? [createLogger({ collapsed: true })] : [])
    ]
  });
  const persistor = persistStore(store);

  // Activate HMR for store reducer
  // https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
  if (module.hot && IS_DEV) {
    module.hot.accept('./root.reducer', () => {
      // https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
      import('./root.reducer').then(({ default: nextReducer }) =>
        store.replaceReducer(nextReducer)
      );
    });
  }

  sagaMiddleware.run(rootSaga);

  return {
    store,
    persistor
  };
}
