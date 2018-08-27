import React, { Component } from 'react';
import { Store } from 'redux';
import { Provider, connect } from 'react-redux';
import { withRouter, Switch, HashRouter, Route, BrowserRouter } from 'react-router-dom';

import { AppState } from 'features/reducers';
import { configSelectors, configMetaSelectors } from 'features/config';
import { transactionMetaActions } from 'features/transaction';
// Components
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Swap from 'containers/Tabs/Swap';
import SignAndVerifyMessage from 'containers/Tabs/SignAndVerifyMessage';
import BroadcastTx from 'containers/Tabs/BroadcastTx';
import CheckTransaction from 'containers/Tabs/CheckTransaction';
import SupportPage from 'containers/Tabs/SupportPage';
import ErrorScreen from 'components/ErrorScreen';
import PageNotFound from 'components/PageNotFound';
import LogOutPrompt from 'components/LogOutPrompt';
import QrSignerModal from 'containers/QrSignerModal';
import OnboardModal from 'containers/OnboardModal';
import WelcomeModal from 'components/WelcomeModal';
import NewAppReleaseModal from 'components/NewAppReleaseModal';
import PalettePage from 'components/Palette';
import { RouteNotFound } from 'components/RouteNotFound';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import { Theme } from 'config';
import 'what-input';

import { OnboardingModal } from 'components/v2';

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
  error: Error | null;
}

class RootClass extends Component<Props, State> {
  public state = {
    error: null
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
    const { store } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }

    const routes = (
      <CaptureRouteNotFound>
        <Switch>
          <Route path="/account" component={SendTransaction} />
          <Route path="/generate" component={GenerateWallet} />
          <Route path="/swap" component={Swap} />
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

    const Router =
      process.env.BUILD_DOWNLOADABLE && process.env.NODE_ENV === 'production'
        ? HashRouter
        : BrowserRouter;

    return (
      <React.Fragment>
        <Provider store={store}>
          <Router>
            <React.Fragment>
              <OnboardingModal />
              {routes}
              <LegacyRoutes />
              <LogOutPrompt />
              <QrSignerModal />
              {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
              {!process.env.DOWNLOADABLE_BUILD && (
                <React.Fragment>
                  <OnboardModal />
                  {!process.env.BUILD_ELECTRON && <WelcomeModal />}
                </React.Fragment>
              )}
            </React.Fragment>
          </Router>
        </Provider>
        <div id="ModalContainer" />
      </React.Fragment>
    );
  }

  private addBodyClasses() {
    const classes = [];

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

const LegacyRoutes = withRouter(props => {
  const { history } = props;
  const { pathname } = props.location;
  let { hash } = props.location;

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
  networkUnit: configSelectors.getNetworkUnit(state),
  theme: configMetaSelectors.getTheme(state)
});

export default connect(mapStateToProps, {
  setUnitMeta: transactionMetaActions.setUnitMeta
})(RootClass);
