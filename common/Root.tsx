import React, { Component } from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { ThemeProvider } from 'styled-components';
// v2
import { GAU_THEME } from 'v2/theme';
import { IS_DEV, IS_ELECTRON } from 'v2/utils';
import { NewAppReleaseModal } from 'v2/components';
import { DevToolsManager } from 'v2/features';
import AppProviders from './AppProviders';
import { AppRouter } from './AppRouter';

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
          <AppRouter />
          <div id="ModalContainer" />
          {IS_ELECTRON ? <NewAppReleaseModal /> : <></>}
          {IS_DEV ? <DevToolsManager /> : <></>}
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
