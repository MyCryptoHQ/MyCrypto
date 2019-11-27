import React, { Component } from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider } from 'styled-components';
// v2
import { BREAK_POINTS, GAU_THEME } from 'v2/theme';
import { IS_DEV, IS_ELECTRON } from 'v2/utils';
import { NewAppReleaseModal } from 'v2/components';
import { DevToolsManager } from 'v2/features';
import AppProviders from './AppProviders';
import { AppRouter } from './AppRouter';

const AppProvidersInnerContainer = styled.div`
  display: flex;
`;
const AppRouterContainer = styled.div`
  flex: 1;
  overflow: auto;
  max-height: 100vh;
`;
const DevToolsManagerContainer = styled.div`
  overflow: auto;
  max-height: 100vh;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: absolute;
    z-index: 100;
    width: 100vw;
  }
`;

class RootClass extends Component {
  public componentDidMount() {
    this.addBodyClasses();
  }

  public componentDidCatch(error: Error) {
    console.error(error);
  }

  public render() {
    return (
      <ThemeProvider theme={GAU_THEME}>
        <AppProviders>
          <AppProvidersInnerContainer>
            {/* DevToolsManager */}
            <DevToolsManagerContainer>
              {IS_DEV ? <DevToolsManager /> : <></>}
            </DevToolsManagerContainer>

            {/* Router */}
            <AppRouterContainer>
              <AppRouter />
              <div id="ModalContainer" />
              {IS_ELECTRON ? <NewAppReleaseModal /> : <></>}
            </AppRouterContainer>
          </AppProvidersInnerContainer>
        </AppProviders>
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
