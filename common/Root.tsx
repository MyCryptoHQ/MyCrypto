import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { withRouter, Switch, Redirect, HashRouter, Route, BrowserRouter } from 'react-router-dom';
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
import { Store } from 'redux';
import { pollOfflineStatus, TPollOfflineStatus } from 'actions/config';
import { AppState } from 'reducers';
import { RouteNotFound } from 'components/RouteNotFound';
import { RedirectWithQuery } from 'components/RedirectWithQuery';
import 'what-input';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import { getNetworkUnit } from 'selectors/config';

interface OwnProps {
  store: Store<AppState>;
}

interface StateProps {
  networkUnit: string;
}

interface DispatchProps {
  pollOfflineStatus: TPollOfflineStatus;
  setUnitMeta: TSetUnitMeta;
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
    this.props.pollOfflineStatus();
    this.props.setUnitMeta(this.props.networkUnit);
    this.addBodyClasses();
  }

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const { store } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }

    const CaptureRouteNotFound = withRouter(({ children, location }) => {
      return location && location.state && location.state.error ? (
        <PageNotFound />
      ) : (
        (children as JSX.Element)
      );
    });

    const routes = (
      <CaptureRouteNotFound>
        <Switch>
          <Redirect exact={true} from="/" to="/account" />
          <Route path="/account" component={SendTransaction} />
          <Route path="/generate" component={GenerateWallet} />
          <Route path="/swap" component={Swap} />
          <Route path="/contracts" component={Contracts} />
          <Route path="/ens" component={ENS} exact={true} />
          <Route path="/sign-and-verify-message" component={SignAndVerifyMessage} />
          <Route path="/tx-status" component={CheckTransaction} exact={true} />
          <Route path="/pushTx" component={BroadcastTx} />
          <Route path="/support-us" component={SupportPage} exact={true} />
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
        <Provider store={store} key={Math.random()}>
          <Router key={Math.random()}>
            <React.Fragment>
              {routes}
              <LegacyRoutes />
              <LogOutPrompt />
              <QrSignerModal />
              {process.env.BUILD_ELECTRON && <NewAppReleaseModal />}
              {!process.env.DOWNLOADABLE_BUILD && (
                <React.Fragment>
                  <OnboardModal />
                  <WelcomeModal />
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

const mapStateToProps = (state: AppState) => {
  return {
    networkUnit: getNetworkUnit(state)
  };
};

export default connect(mapStateToProps, {
  pollOfflineStatus,
  setUnitMeta
})(RootClass);
