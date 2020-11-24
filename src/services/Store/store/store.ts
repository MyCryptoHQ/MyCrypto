import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { IS_DEV } from '@utils';

import { REDUX_PERSIST_ACTION_TYPES } from './persist.config';
import rootReducer from './reducer';
import rootSaga from './sagas';
import { serializeLegacyMiddleware } from './serialize.middleware';

export default function createStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      serializeLegacyMiddleware,
      ...getDefaultMiddleware({
        thunk: false, // MYC uses sagas
        serializableCheck: {
          // ignore redux-persist actions during serialize check.
          // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
          ignoredActions: [...REDUX_PERSIST_ACTION_TYPES]
        }
      }),
      sagaMiddleware,
      // Logger MUST be last in chain.
      // https://github.com/LogRocket/redux-logger#usage
      ...(IS_DEV ? [createLogger({ collapsed: true })] : [])
    ]
  });
  const persistor = persistStore(store);

  // Activate HMR for store reducer
  // https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
  if (module.hot && IS_DEV) {
    module.hot.accept('./reducer', () => {
      // https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
      import('./reducer').then(({ default: nextReducer }) => store.replaceReducer(nextReducer));
    });
  }

  sagaMiddleware.run(rootSaga);

  return {
    store,
    persistor
  };
}
