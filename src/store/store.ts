import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  getStoredState,
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

import { LocalStorage } from '@types';
import { IS_DEV } from '@utils';

import { serializeEntitiesMiddleware } from './entities';
import rootReducer from './root.reducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const AppPersistConfig = {
  key: 'Storage',
  keyPrefix: 'MYC:',
  storage,
  debug: true,
  blacklist: ['networks', 'assets', 'vault']
};

export const exportState = () => getStoredState(AppPersistConfig).then((s) => s as LocalStorage);

const store = configureStore({
  reducer: persistReducer(AppPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // by convention we use sagas
      thunk: false,
      serializableCheck: {
        // ignore redux-persist actions during serialize check.
        // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
      .prepend(serializeEntitiesMiddleware)
      .concat(sagaMiddleware)
});

// Activate HMR for store reducer
// https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
if (module.hot && IS_DEV) {
  module.hot.accept('./root.reducer', () => {
    import('./root.reducer').then(({ default: nextReducer }) =>
      // https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
      store.replaceReducer(persistReducer(AppPersistConfig, nextReducer))
    );
  });
}
// Initializs sagas
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;
