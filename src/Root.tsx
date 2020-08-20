import React, { Component } from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider } from 'styled-components';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import { GAU_THEME } from '@theme';
import { IS_ELECTRON, IS_DOWNLOADABLE, IS_PROD } from '@utils';
import { NewAppReleaseModal } from '@components';
import { DevToolsManager } from '@features';
import AppProviders from './AppProviders';
import { AppRoutes } from './AppRoutes';

const AppProvidersInnerContainer = styled.div`
  display: flex;
  min-height: 100%;
`;
const AppRouterContainer = styled.div`
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;

class RootClass extends Component {
  public componentDidMount() {
    this.addBodyClasses();
  }

  public render() {
    const Router: any = IS_DOWNLOADABLE && IS_PROD ? HashRouter : BrowserRouter;

    return (
      <ThemeProvider theme={GAU_THEME}>
        <Router>
          <AppProviders>
            <AppProvidersInnerContainer>
              {/* DevToolsManager */}
              <DevToolsManager />

              {/* Router */}
              <AppRouterContainer>
                <AppRoutes />
                <div id="ModalContainer" />
                {IS_ELECTRON ? <NewAppReleaseModal /> : <></>}
              </AppRouterContainer>
            </AppProvidersInnerContainer>
          </AppProviders>
        </Router>
      </ThemeProvider>
    );
  }

  private addBodyClasses() {
    const classes: string[] = [];

    if (IS_ELECTRON) {
      classes.push('is-electron');

      if (navigator.appVersion.includes('Win')) {
        classes.push('is-windows');
      } else if (navigator.appVersion.includes('Mac')) {
        classes.push('is-osx');
      } else {
        classes.push('is-linux');
      }
    }

    document.body.className += ` ${classes.join(' ')}`;
  }
}

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(RootClass);
