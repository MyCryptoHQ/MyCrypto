import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Redirect, Route } from 'react-router';
import PropTypes from 'prop-types';
import { App } from 'containers';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import ViewWallet from 'containers/Tabs/ViewWallet';
import Help from 'containers/Tabs/Help';
import Swap from 'containers/Tabs/Swap';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Contracts from 'containers/Tabs/Contracts';
import ENS from 'containers/Tabs/ENS';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object,
    history: PropTypes.object
  };

  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <Router history={history} key={Math.random()}>
          <Route name="App" path="" component={App}>
            <Route name="GenerateWallet" path="/" component={GenerateWallet} />
            <Route
              name="ViewWallet"
              path="/view-wallet"
              component={ViewWallet}
            />
            <Route name="Help" path="/help" component={Help} />
            <Route name="Swap" path="/swap" component={Swap} />
            <Route
              name="Send"
              path="/send-transaction"
              component={SendTransaction}
            />
            <Route name="Contracts" path="/contracts" component={Contracts} />
            <Route name="ENS" path="/ens" component={ENS} />
            <Redirect from="/*" to="/" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
