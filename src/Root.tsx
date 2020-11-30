import React from 'react';

import { store } from '@store';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
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

const RootClass = () => {
  const Router: any = USE_HASH_ROUTER ? HashRouter : BrowserRouter;

  return (
    <Provider store={store}>
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
    </Provider>
  );
};

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(RootClass);
