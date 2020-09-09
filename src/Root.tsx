import React from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider } from 'styled-components';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import { theme } from '@theme';
import { IS_ELECTRON, USE_HASH_ROUTER } from '@utils';
import { NewAppReleaseModal } from '@components';
import { DevToolsManager } from '@features';
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
    <ThemeProvider theme={theme}>
      <Router>
        <AppProviders>
          <FullHeight>
            <DevToolsManager />
            <FullScreen id="ModalContainer">
              <AppRoutes />
              {IS_ELECTRON && <NewAppReleaseModal />}
            </FullScreen>
          </FullHeight>
        </AppProviders>
      </Router>
    </ThemeProvider>
  );
};

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(RootClass);
