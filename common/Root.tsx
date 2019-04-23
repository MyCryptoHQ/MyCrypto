import React, { Component } from 'react';
import { Store } from 'redux';
import { Provider, connect } from 'react-redux';
import { withRouter, Switch, HashRouter, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { light } from '@mycrypto/ui';

import { AnalyticsService } from 'v2/services';
import { AppState } from 'features/reducers';
import { configSelectors, configMetaSelectors } from 'features/config';
import { transactionMetaActions } from 'features/transaction';
import { onboardingSelectors } from 'features/onboarding';
// Components
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import SendTransaction from 'containers/Tabs/SendTransaction';
import SignAndVerifyMessage from 'containers/Tabs/SignAndVerifyMessage';
import BroadcastTx from 'containers/Tabs/BroadcastTx';
import CheckTransaction from 'containers/Tabs/CheckTransaction';
import SupportPage from 'containers/Tabs/SupportPage';
import ErrorScreen from 'components/ErrorScreen';
import PageNotFound from 'components/PageNotFound';
import LogOutPrompt from 'components/LogOutPrompt';
import QrSignerModal from 'containers/QrSignerModal';
import OnboardingModal from 'containers/OnboardingModal';
import NewAppReleaseModal from 'components/NewAppReleaseModal';
import PalettePage from 'components/Palette';
import { RouteNotFound } from 'components/RouteNotFound';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import { Theme } from 'config';
import 'what-input';

// v2
// import { gatherFeatureRoutes } from 'v2';
import DevTools from 'v2/features/DevTools';
import { AccountProvider } from 'v2/providers/AccountProvider';
import { AddressMetadataProvider } from 'v2/providers/AddressMetadataProvider';
import { NetworkOptionsProvider } from 'v2/providers/NetworkOptionsProvider';
import { TransactionProvider } from 'v2/providers/TransactionProvider';
import { TransactionHistoryProvider } from 'v2/providers/TransactionHistoryProvider';
import PrivateRoute from 'v2/features/NoAccounts/NoAccountAuth';
import Dashboard from 'v2/features/Dashboard';

interface OwnProps {
  store: Store<AppState>;
}

interface StateProps {
  onboardingActive: ReturnType<typeof onboardingSelectors.getActive>;
  networkUnit: ReturnType<typeof configSelectors.getNetworkUnit>;
  theme: ReturnType<typeof configMetaSelectors.getTheme>;
}

interface DispatchProps {
  setUnitMeta: transactionMetaActions.TSetUnitMeta;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  error: Error | null;
  developmentMode: boolean;
}

class RootClass extends Component<Props, State> {
  public state = {
    error: null,
    developmentMode: Boolean(window.localStorage.getItem('MyCrypto Dev Mode'))
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
    const { store, onboardingActive } = this.props;
    const { error, developmentMode } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }
    const routes = (
      <CaptureRouteNotFound>
        <Switch>
          {/* {gatherFeatureRoutes().map((config, i) => <Route key={i} {...config} />)} */}
          <PrivateRoute path="/dashboard" component={Dashboard} />

          <Route path="/account" component={SendTransaction} />
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
      </CaptureRouteNotFound>
    );

    const Router: any =
      process.env.BUILD_DOWNLOADABLE && process.env.NODE_ENV === 'production'
        ? HashRouter
        : BrowserRouter;

    return (
      <ThemeProvider theme={light}>
        <React.Fragment>
          <Provider store={store}>
            <AddressMetadataProvider>
              <AccountProvider>
                <TransactionProvider>
                  <TransactionHistoryProvider>
                    <NetworkOptionsProvider>
                      <Router>
                        <PageVisitsAnalytics>
                          {onboardingActive && <OnboardingModal />}
                          {routes}
                          <LegacyRoutes />
                          <LogOutPrompt />
                          <QrSignerModal />
                          {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
                        </PageVisitsAnalytics>
                      </Router>
                      {developmentMode && <DevTools />}
                      <div id="ModalContainer" />
                    </NetworkOptionsProvider>
                  </TransactionHistoryProvider>
                </TransactionProvider>
              </AccountProvider>
            </AddressMetadataProvider>
          </Provider>
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={this.handleDevelopmentModeButtonClick}
              style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 99,
                height: '5rem'
              }}
            >
              Development Mode {developmentMode ? 'On' : 'Off'}
            </button>
          )}
        </React.Fragment>
      </ThemeProvider>
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
  private handleDevelopmentModeButtonClick = () => {
    const isDevelopmentMode = window.localStorage.getItem('MyCrypto Dev Mode');

    if (isDevelopmentMode) {
      window.localStorage.removeItem('MyCrypto Dev Mode');
      this.setState({ developmentMode: false });
    } else {
      window.localStorage.setItem('MyCrypto Dev Mode', 'true');
      this.setState({ developmentMode: true });
    }
  };
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

const CaptureRouteNotFound = withRouter(({ children, location }) => {
  return location && location.state && location.state.error ? (
    <PageNotFound />
  ) : (
    (children as JSX.Element)
  );
});

const mapStateToProps = (state: AppState): StateProps => ({
  onboardingActive: onboardingSelectors.getActive(state),
  networkUnit: configSelectors.getNetworkUnit(state),
  theme: configMetaSelectors.getTheme(state)
});

export default connect(mapStateToProps, {
  setUnitMeta: transactionMetaActions.setUnitMeta
})(RootClass);
