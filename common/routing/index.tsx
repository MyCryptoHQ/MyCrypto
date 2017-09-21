import App from 'containers';
import ENS from 'containers/Tabs/ENS';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import Help from 'containers/Tabs/Help';
import SendTransaction from 'containers/Tabs/SendTransaction';
import Swap from 'containers/Tabs/Swap';
import ViewWallet from 'containers/Tabs/ViewWallet';
import { useBasename } from 'history';
import React from 'react';
import { browserHistory, Redirect, Route } from 'react-router';

export const history = getHistory();
export const Routing = () =>
  <Route name="App" path="" component={App}>
    <Route name="GenerateWallet" path="/" component={GenerateWallet} />
    <Route name="ViewWallet" path="/view-wallet" component={ViewWallet} />
    <Route name="Help" path="/help" component={Help} />
    <Route name="Swap" path="/swap" component={Swap} />
    <Route name="Send" path="/send-transaction" component={SendTransaction} />
    <Route name="ENS" path="/ens" component={ENS} />
    <Redirect from="/*" to="/" />
  </Route>;

function getHistory() {
  const basename = '';
  return useBasename(() => browserHistory)({ basename });
}
