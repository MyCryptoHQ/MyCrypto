import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import RootReducer, { AppState } from './reducers';
import sagas from './sagas';
import { rehydrateConfigAndCustomTokenState } from './configAndTokens';

export default function configureStore() {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;
  let store: Store<AppState>;

  if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(
      applyMiddleware(sagaMiddleware, logger, routerMiddleware(history as any))
    );
  } else {
    middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history as any));
  }

  const persistedInitialState: Partial<AppState> = {
    ...rehydrateConfigAndCustomTokenState()
  };

  store = createStore<AppState>(RootReducer, persistedInitialState as any, middleware);
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.ROOT, 'Language initially loaded', {
    lang: persistedInitialState.config && persistedInitialState.config.meta.languageSelection
  });

  // Add all of the sagas to the middleware
  Object.keys(sagas).forEach((saga: keyof typeof sagas) => {
    sagaMiddleware.run(sagas[saga]);
  });

  return store;
}
