import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { withRouter, Switch, Redirect, HashRouter, Route, BrowserRouter } from 'react-router-dom';
// Components
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import Help from 'containers/Tabs/Help';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Swap from 'containers/Tabs/Swap';
import SignAndVerifyMessage from 'containers/Tabs/SignAndVerifyMessage';
import BroadcastTx from 'containers/Tabs/BroadcastTx';
import ErrorScreen from 'components/ErrorScreen';
import PageNotFound from 'components/PageNotFound';
import LogOutPrompt from 'components/LogOutPrompt';
import { Store } from 'redux';
import { pollOfflineStatus } from 'actions/config';
import { AppState } from 'reducers';

interface Props {
  store: Store<AppState>;
}

interface State {
  error: Error | null;
}

export default class Root extends Component<Props, State> {
  public state = {
    error: null
  };

  public componentDidMount() {
    this.props.store.dispatch(pollOfflineStatus());
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

    const RouteWithSubRoutes = ({ path, subRoutes, BaseComponent }) => (
      <Route
        path={path}
        render={props => {
          const validRoutes = [path, ...subRoutes].filter(
            route => subRoutes.includes(route) || route === path
          );
          return validRoutes.includes(props.location.pathname) ? (
            <BaseComponent {...props} />
          ) : (
            <PageNotFound {...props} />
          );
        }}
      />
    );

    const routes = (
      <Switch>
        <Route exact={true} path="/" component={GenerateWallet} />
        <RouteWithSubRoutes
          path="/generate"
          BaseComponent={GenerateWallet}
          subRoutes={['/generate/keystore', '/generate/mnemonic']}
        />
        <Route path="/help" component={Help} />
        <Route path="/swap" component={Swap} />
        <RouteWithSubRoutes
          path="/account"
          BaseComponent={SendTransaction}
          subRoutes={['/account/send', '/account/info', '/account/request']}
        />
        <Route path="/send-transaction" component={SendTransaction} />
        <RouteWithSubRoutes
          path="/contracts"
          BaseComponent={Contracts}
          subRoutes={['/contracts/interact', '/contracts/deploy']}
        />
        <Route path="/ens" component={ENS} />
        <Route path="/sign-and-verify-message" component={SignAndVerifyMessage} />
        <Route path="/pushTx" component={BroadcastTx} />
        <Route component={PageNotFound} />
      </Switch>
    );

    const Router = process.env.BUILD_DOWNLOADABLE ? HashRouter : BrowserRouter;

    return (
      <Provider store={store} key={Math.random()}>
        <Router key={Math.random()}>
          <React.Fragment>
            {routes}
            <LegacyRoutes />
            <LogOutPrompt />
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

const LegacyRoutes = withRouter(props => {
  const { history } = props;
  const { pathname, hash } = props.location;

  if (pathname === '/') {
    switch (hash) {
      case '#send-transaction':
      case '#offline-transaction':
        history.push('/send-transaction');
        break;
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
        history.push('/check-tx-status');
        break;
    }
  }

  return (
    <Switch>
      <Redirect from="/signmsg.html" to="/sign-and-verify-message" />
      <Redirect from="/helpers.html" to="/helpers" />
      <Redirect from="/send-transaction" to="/account/send" />
    </Switch>
  );
});
