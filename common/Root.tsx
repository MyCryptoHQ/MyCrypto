import React, { Component } from 'react';
import { setConfig } from 'react-hot-loader';
import { hot } from 'react-hot-loader/root';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Store } from 'redux';
import { ThemeProvider } from 'styled-components';

import { Theme } from 'config';
import {
  ErrorScreen,
  LogOutPrompt,
  PageNotFound,
  PalettePage,
  RedirectWithQuery,
  RouteNotFound
} from 'components';
import {
  BroadcastTx,
  CheckTransaction,
  Contracts,
  ENS,
  GenerateWallet,
  QrSignerModal,
  SendTransaction,
  SignAndVerifyMessage,
  SupportPage
} from 'containers';
import { configMetaSelectors, configSelectors } from 'features/config';

import { AppState } from 'features/reducers';
import { transactionMetaActions } from 'features/transaction';

// v2
import { GAU_THEME } from 'v2/theme';
import { IS_DEV, IS_PROD } from 'v2/utils';
import { HomepageChoiceRedirect } from 'v2/routing';
import { PrivateRoute, NewAppReleaseModal } from 'v2/components';
import { AnalyticsService, DevModeProvider, useDevMode } from 'v2/services';
import { appRoutes, DevTools, Home } from 'v2/features';
import { ScreenLockProvider } from 'v2/providers';
import AppProviders from './AppProviders';

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

interface State {
  error: Error | undefined;
}

class RootClass extends Component<Props, State> {
  public state = {
    error: undefined
  };

  public componentDidMount() {
    this.props.setUnitMeta(this.props.networkUnit);
    this.addBodyClasses();
    this.updateTheme(this.props.theme);
  }

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.theme !== prevProps.theme) {
      this.updateTheme(this.props.theme, prevProps.theme);
    }
  }

  public render() {
    const { error } = this.state;
    const { store } = this.props;

    const Router: any = process.env.BUILD_DOWNLOADABLE && IS_PROD ? HashRouter : BrowserRouter;

    return (
      <DevModeProvider>
        <ThemeProvider theme={GAU_THEME}>
          <Provider store={store}>
            <Router>
              <AppProviders>
                <ScreenLockProvider>
                  <HomepageChoiceRedirect>
                    <PageVisitsAnalytics>
                      {error ? <AppContainer error={error} /> : <AppContainer />}
                      <LogOutPrompt />
                      <QrSignerModal />
                      {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
                    </PageVisitsAnalytics>
                  </HomepageChoiceRedirect>
                </ScreenLockProvider>
                <DevToolsContainer />
                <div id="ModalContainer" />
                {IS_DEV ? <DevModeToggle /> : <></>}
              </AppProviders>
            </Router>
          </Provider>
        </ThemeProvider>
      </DevModeProvider>
    );
  }

  private addBodyClasses() {
    const classes: string[] = [];

    if (process.env.BUILD_ELECTRON) {
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

let previousURL = '';
const PageVisitsAnalytics = withRouter(({ history, children }) => {
  history.listen(() => {
    if (previousURL !== window.location.href) {
      AnalyticsService.instance.trackPageVisit(window.location.href);
      previousURL = window.location.href;
    }
  });
  return <React.Fragment>{children}</React.Fragment>;
});

const LegacyRoutes = withRouter(props => {
  const { history } = props;
  const { pathname, search } = props.location;
  let { hash } = props.location;

  if (search.includes('redirectToSignMessage')) {
    history.push('/sign-and-verify-message');
    return null;
  }

  if (pathname === '/') {
    hash = hash.split('?')[0];
    switch (hash) {
      case '#send-transaction':
      case '#offline-transaction':
        return <RedirectWithQuery from={pathname} to={'account/send'} />;
      case '#generate-wallet':
        history.push('/');
        break;
      case '#swap':
        history.push('/swap');
        break;
      case '#contracts':
        history.push('/contracts');
        break;
      case '#ens':
        history.push('/ens');
        break;
      case '#view-wallet-info':
        history.push('/account/info');
        break;
      case '#check-tx-status':
        return <RedirectWithQuery from={pathname} to={'/tx-status'} />;
    }
  }

  return (
    <Switch>
      <RedirectWithQuery from="/signmsg.html" to="/sign-and-verify-message" />
      <RedirectWithQuery from="/helpers.html" to="/helpers" />
      <RedirectWithQuery from="/send-transaction" to={'/account/send'} />
    </Switch>
  );
});

interface AppContainerProps {
  error?: Error | undefined;
}

const AppContainer = (props: AppContainerProps) => {
  const { isDevelopmentMode } = useDevMode();
  const { error } = props;

  if (error !== undefined && !isDevelopmentMode) {
    return <ErrorScreen error={error} />;
  }

  return (
    <>
      <CaptureRouteNotFound>
        <HomepageChoiceRedirect>
          <Switch>
            {/* To avoid fiddling with layout we provide a complete route to home */}
            <Route path="/" component={Home} exact={true} />
            <Route path="/home" component={Home} exact={true} />
            {appRoutes.map((config, idx) => (
              <PrivateRoute key={idx} {...config} />
            ))}
            <Route path="/account" component={SendTransaction} exact={true} />
            <Route path="/generate" component={GenerateWallet} />
            <Route path="/contracts" component={Contracts} />
            <Route path="/ens" component={ENS} exact={true} />
            <Route path="/sign-and-verify-message" component={SignAndVerifyMessage} />
            <Route path="/tx-status" component={CheckTransaction} exact={true} />
            <Route path="/pushTx" component={BroadcastTx} />
            <Route path="/support-us" component={SupportPage} exact={true} />
            {process.env.NODE_ENV !== 'production' && (
              <Route path="/dev/palette" component={PalettePage} exact={true} />
            )}
            <RedirectWithQuery exactArg={true} from="/" to="/account" pushArg={true} />
            <RouteNotFound />
          </Switch>
        </HomepageChoiceRedirect>
      </CaptureRouteNotFound>

      <LegacyRoutes />
    </>
  );
};

const DevModeToggle = () => {
  const { isDevelopmentMode, toggleDevMode } = useDevMode();
  return (
    <button
      onClick={toggleDevMode}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 99,
        height: '5rem'
      }}
    >
      Development Mode {isDevelopmentMode ? 'On' : 'Off'}
    </button>
  );
};

const DevToolsContainer = () => {
  const { isDevelopmentMode } = useDevMode();
  return isDevelopmentMode ? <DevTools /> : <></>;
};

const CaptureRouteNotFound = withRouter(({ children, location }) => {
  return location && location.state && location.state.error ? (
    <PageNotFound />
  ) : (
    (children as JSX.Element)
  );
});

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
