import React, { useEffect } from 'react';

import { APP_PERSIST_CONFIG, createStore, useDispatch } from '@store';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { getStoredState, REHYDRATE } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import styled, { ThemeProvider } from 'styled-components';

import { DevToolsManager } from '@features';
import { theme } from '@theme';
import { USE_HASH_ROUTER } from '@utils';

import AppProviders from './AppProviders';
import { AppRoutes } from './AppRoutes';

const FullHeight = styled.div`
  display: flex;
  min-height: 100%;
`;
const FullScreen = styled.div`
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;

const { store, persistor } = createStore();
const E2EHelpers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.rehydrate = () =>
      getStoredState(APP_PERSIST_CONFIG).then((ls) => {
        console.log('In Rehydrate', ls, ls.legacy.accounts);
        dispatch({
          type: REHYDRATE,
          payload: ls
        });
      });
  }, []);
  return <></>;
};

const RootClass = () => {
  const Router: any = USE_HASH_ROUTER ? HashRouter : BrowserRouter;

  return (
    <Provider store={store}>
      <E2EHelpers />
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Router>
            <AppProviders>
              <FullHeight>
                <DevToolsManager />
                <FullScreen id="ModalContainer">
                  <AppRoutes />
                </FullScreen>
              </FullHeight>
            </AppProviders>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(RootClass);
