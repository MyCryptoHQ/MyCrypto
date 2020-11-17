import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { IS_DEV } from '@utils';
import { pipe } from '@vendor';

import rootReducer from './reducer';
import rootSaga from './sagas';

const APP_PERSIST_CONFIG = {
  key: 'Storage',
  keyPrefix: 'MYC:',
  storage,
  blacklist: [],
  throttle: 3000
  // serialize    -> (s) => marshallState(s)
  // deserialize  -> (s) => deMarshallState(s.legacay)
};

const createPersistReducer = (reducer: typeof rootReducer) =>
  persistReducer(APP_PERSIST_CONFIG, reducer);

const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: createPersistReducer(rootReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false, // MYC uses sagas
        serializableCheck: {
          // ignore redux-persist actions during serialize check.
          // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat(sagaMiddleware)
  });
  const persistor = persistStore(store);

  // Activate HMR for store reducer
  // https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
  if (module.hot && IS_DEV) {
    module.hot.accept('./reducer', () => {
      // https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
      import('./reducer').then(({ default: nextReducer }) =>
        pipe(createPersistReducer, store.replaceReducer)(nextReducer)
      );
    });
  }

  sagaMiddleware.run(rootSaga);

  return {
    store,
    persistor
  };
};

export default createStore;
