import React, { Component } from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { connect, Provider } from 'react-redux';
import { Store } from 'redux';
import { ThemeProvider } from 'styled-components';
import { Theme } from 'config';
import { QrSignerModal } from 'containers';
import { configMetaSelectors, configSelectors } from 'features/config';
import { AppState } from 'features/reducers';
import { transactionMetaActions } from 'features/transaction';

// v2
import { GAU_THEME } from 'v2/theme';
import { IS_DEV, IS_ELECTRON } from 'v2/utils';
import { NewAppReleaseModal } from 'v2/components';
import { DevToolsManager } from 'v2/features';
import AppProviders from './AppProviders';
import { AppRouter } from './AppRouter';

interface OwnProps {
  store: Store<AppState>;
}

interface StateProps {
  networkUnit: ReturnType<typeof configSelectors.getNetworkUnit>;
  theme: ReturnType<typeof configMetaSelectors.getTheme>;
}

interface DispatchProps {
  setUnitMeta: transactionMetaActions.TSetUnitMeta;
}

type Props = OwnProps & StateProps & DispatchProps;

class RootClass extends Component<Props> {
  public componentDidMount() {
    this.props.setUnitMeta(this.props.networkUnit);
    this.addBodyClasses();
    this.updateTheme(this.props.theme);
  }

  public componentDidCatch(error: Error) {
    console.error(error);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.theme !== prevProps.theme) {
      this.updateTheme(this.props.theme, prevProps.theme);
    }
  }

  public render() {
    const { store } = this.props;

    return (
      <ThemeProvider theme={GAU_THEME}>
        <Provider store={store}>
          <AppProviders>
            <AppRouter />
            <QrSignerModal />
            <div id="ModalContainer" />
            {IS_ELECTRON ? <NewAppReleaseModal /> : <></>}
            {IS_DEV ? <DevToolsManager /> : <></>}
          </AppProviders>
        </Provider>
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

  private updateTheme(theme: Theme, oldTheme?: Theme) {
    const root = document.documentElement;
    if (oldTheme) {
      root.classList.remove(`theme--${oldTheme}`);
    }
    root.classList.add(`theme--${theme}`);
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  networkUnit: configSelectors.getNetworkUnit(state),
  theme: configMetaSelectors.getTheme(state)
});

const ConnectedRoot = connect(
  mapStateToProps,
  {
    setUnitMeta: transactionMetaActions.setUnitMeta
  }
)(RootClass);

// Silence RHL 'reconciliation failed' errors
// https://github.com/gatsbyjs/gatsby/issues/7209#issuecomment-415807021
setConfig({ logLevel: 'no-errors-please' });
export default hot(ConnectedRoot);
