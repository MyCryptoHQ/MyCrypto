import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
// Components
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import Help from 'containers/Tabs/Help';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Swap from 'containers/Tabs/Swap';
import ViewWallet from 'containers/Tabs/ViewWallet';
import BroadcastTx from 'containers/Tabs/BroadcastTx';

// TODO: fix this
interface Props {
  store: any;
  history: any;
}

export default class Root extends Component<Props, {}> {
  public render() {
    const { store, history } = this.props;
    // key={Math.random()} = hack for HMR from https://github.com/webpack/webpack-dev-server/issues/395
    return (
      <Provider store={store} key={Math.random()}>
        <Router history={history} key={Math.random()}>
          <div>
            <Route exact={true} path="/" component={GenerateWallet} />
            <Route path="/view-wallet" component={ViewWallet} />
            <Route path="/help" component={Help} />
            <Route path="/swap" component={Swap} />
            <Route path="/send-transaction" component={SendTransaction} />
            <Route path="/contracts" component={Contracts} />
            <Route path="/ens" component={ENS} />
            <Route path="/pushTx" component={BroadcastTx} />
          </div>
        </Router>
      </Provider>
    );
  }
}
