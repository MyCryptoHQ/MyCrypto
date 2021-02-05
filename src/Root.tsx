import React from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import { AppLoading, Box } from '@components';
import { DevToolsManager } from '@features';
import { FeatureFlagProvider } from '@services';
import { createStore } from '@store';
import { COLORS, theme } from '@theme';
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

const GlobalStyle = createGlobalStyle`
::-webkit-scrollbar-track {
  background-color: ${COLORS.GREY_ATHENS};
  box-shadow: none;
}

::-webkit-scrollbar {
  width: 10px;
  box-shadow: none;
  background-color: ${COLORS.GREY_ATHENS};
}

::-webkit-scrollbar-thumb {
  box-shadow: none;
  border-radius: 0;
  background-color: ${COLORS.BLUE_DARK_SLATE};
}
`;

const { store, persistor } = createStore();

const RootComponent = () => {
  const Router: any = USE_HASH_ROUTER ? HashRouter : BrowserRouter;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
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

const Root = () => {
  return (
    <Provider store={store}>
      <FeatureFlagProvider>
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
      </FeatureFlagProvider>
    </Provider>
  );
};

export default Root;
