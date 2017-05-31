import React from 'react';
import {browserHistory, Redirect, Route} from 'react-router';
import {useBasename} from 'history';
import {App} from 'containers';
import GenerateWallet from 'containers/Tabs/GenerateWallet'
import WalletDecrypt from 'containers/Tabs/WalletDecrypt'
import Help from 'containers/Tabs/Help'
import Swap from 'containers/Tabs/Swap'

export const history = getHistory()

export const Routing = () => (
    <Route name="App" path='' component={App}>
        <Route name="GenerateWallet" path="/" component={GenerateWallet}/>
        <Route name="ViewWallet" path="/view-wallet" component={WalletDecrypt}/>
        <Route name="Help" path="/help" component={Help}/>
        <Route name="Swap" path="/swap" component={Swap}/>

        <Redirect from="/*" to="/"/>
    </Route>
)


function getHistory() {
    const basename = ''
    return useBasename(() => browserHistory)({basename})
}
