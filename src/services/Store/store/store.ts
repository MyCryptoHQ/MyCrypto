import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import {
  connectHDWallet,
  getAccounts,
  processAccountsQueue,
  requestConnectionSuccess
} from '@features/AddAccount/components/hdWallet.slice';
import { messageUpdate, signMessage } from '@features/SignAndVerifyMessage';
import { analyticsMiddleware } from '@services/Analytics';
import { startBalancesPolling, startRatesPolling, updateAccounts } from '@store';
import { IS_DEV } from '@utils';

import { REDUX_PERSIST_ACTION_TYPES } from './persist.config';
import rootReducer, { AppState } from './root.reducer';
import rootSaga from './sagas';
import { serializeLegacyMiddleware } from './serialize.middleware';

export default function createStore(initialState?: PreloadedState<AppState>) {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => [
      serializeLegacyMiddleware,
      ...getDefaultMiddleware({
        immutableCheck: IS_DEV,
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
            startRatesPolling.type,
            startBalancesPolling.type,
            // ignore these actions to avoid errors with hardware wallet sessions
            connectHDWallet.type,
            requestConnectionSuccess.type,
            getAccounts.type,
            processAccountsQueue.type,
            // We pass an IFullWallet instance to signMessageSaga
            signMessage.type,
            // Skip check when typing in form
            messageUpdate.type
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
