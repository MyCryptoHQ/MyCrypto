import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { IS_DEV } from '@utils';

import rootReducer from './reducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});

// Activate HMR for store reducer
// https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
if (module.hot && IS_DEV) {
  module.hot.accept('./reducer', () => {
    import('./reducer').then(({ default: nextReducer }) => store.replaceReducer(nextReducer));
  });
}

sagaMiddleware.run(rootSaga);

export default store;
