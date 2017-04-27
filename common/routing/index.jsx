import React from "react";
import {browserHistory, Redirect, Route} from "react-router";
import {useBasename} from "history";
import {App} from "containers";
import GenerateWallet from "containers/Tabs/GenerateWallet"
import ViewWallet from "containers/Tabs/ViewWallet"

console.log(GenerateWallet)

export const history = getHistory()

export const Routing = () => (
    <Route name="App" path='' component={App}>
        <Route name="GenerateWallet" path="/" component={GenerateWallet}/>
        <Route name="ViewWallet" path="/view-wallet" component={ViewWallet}/>

        <Redirect from="/*" to="/"/>
    </Route>
)


function getHistory() {
    const basename = ''
    return useBasename(() => browserHistory)({basename})
}
