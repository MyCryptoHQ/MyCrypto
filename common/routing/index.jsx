import React from "react";
import {browserHistory, Redirect, Route} from "react-router";
import {useBasename} from "history";
import {App, Tabs} from "containers";

export const history = getHistory()

export const Routing = () => (
    <Route name="App" path='' component={App}>
        <Route name="Tabs" path="/" component={Tabs}/>
        <Redirect from="/*" to="/"/>
    </Route>
)


function getHistory() {
    const basename =  ''
    return useBasename(() => browserHistory)({basename})
}
