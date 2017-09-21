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
  <Route path="" component={App}>
    <Route path="/" component={GenerateWallet} />
    <Route path="/view-wallet" component={ViewWallet} />
    <Route path="/help" component={Help} />
    <Route path="/swap" component={Swap} />
    <Route path="/send-transaction" component={SendTransaction} />
    <Route path="/ens" component={ENS} />
    <Redirect from="/*" to="/" />
  </Route>;

function getHistory() {
  const basename = '';
  return useBasename(() => browserHistory)({ basename });
}
