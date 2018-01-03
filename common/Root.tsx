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
import { Store } from 'redux';
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

  public componentDidCatch(error: Error) {
    this.setState({ error });
  }

  public render() {
    const { store } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorScreen error={error} />;
    }

    // key={Math.random()} = hack for HMR from https://github.com/webpack/webpack-dev-server/issues/395
    const routes = (
      <Switch>
        <Route exact={true} path="/" component={GenerateWallet} />
        <Route path="/generate" component={GenerateWallet}>
          <Route path="keystore" component={GenerateWallet} />
          <Route path="mnemonic" component={GenerateWallet} />
        </Route>
        <Route path="/help" component={Help} />
        <Route path="/swap" component={Swap} />
        <Route path="/account" component={SendTransaction}>
          <Route path="send" component={SendTransaction} />
          <Route path="info" component={SendTransaction} />
        </Route>
        <Route path="/send-transaction" component={SendTransaction} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/ens" component={ENS} />
        <Route path="/sign-and-verify-message" component={SignAndVerifyMessage} />
        <Route path="/pushTx" component={BroadcastTx} />
        <Route component={PageNotFound} />
        <LegacyRoutes />
      </Switch>
    );
    return (
      <Provider store={store} key={Math.random()}>
        {process.env.BUILD_DOWNLOADABLE ? (
          <HashRouter key={Math.random()}>{routes}</HashRouter>
        ) : (
          <BrowserRouter key={Math.random()}>{routes}</BrowserRouter>
        )}
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
