import React from 'react';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { AppLoading, Box } from '@components';
import { DevToolsManager } from '@features';
import { COLORS, theme } from '@theme';
import { USE_HASH_ROUTER } from '@utils';

import AppProviders from './AppProviders';
import { AppRoutes } from './AppRoutes';

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

const Router: any = USE_HASH_ROUTER ? HashRouter : BrowserRouter;

const App = ({ storeReady }: { storeReady: boolean }) => {
  return storeReady ? (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppProviders>
          <Box display="flex" height="100%">
            <DevToolsManager />
            <Box display="flex" flex="1" maxWidth="100vw" maxHeight="vh" id="ModalContainer">
              <AppRoutes />
            </Box>
          </Box>
        </AppProviders>
      </Router>
    </ThemeProvider>
  ) : (
    <Box variant="rowCenter">
      <AppLoading />
    </Box>
  );
};

export default App;
