import React from 'react';

import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import styled, { ThemeProvider } from 'styled-components';

import { AppLoading, Box } from '@components';
import { DevToolsManager } from '@features';
import { trackInit } from '@services/Analytics';
import { createStore, useDispatch } from '@store';
import { theme } from '@theme';
import { USE_HASH_ROUTER } from '@utils';
import { useEffectOnce } from '@vendor';

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

const RootComponent = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(trackInit());
  });

  const Router: any = USE_HASH_ROUTER ? HashRouter : BrowserRouter;
  return (
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
  );
};

const RootClass = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {(isHydrated: boolean) =>
          isHydrated ? (
            <RootComponent />
          ) : (
            <Box variant="rowCenter">
              <AppLoading />
            </Box>
          )
        }
      </PersistGate>
    </Provider>
  );
};

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(RootClass);
