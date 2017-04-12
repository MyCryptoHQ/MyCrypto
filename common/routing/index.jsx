import React from 'react';
import {Route, Redirect, browserHistory, IndexRoute} from 'react-router';
import {useBasename} from 'history'
import {App, Dashboard} from 'containers';

export const history = getHistory()

/**
 * Returns application routing with protected by AuthCheck func routes
 * @param {Function} AuthCheck checks is user logged in
 */
export const Routing = (AuthCheck) => (
    <Route name="App" path='' component={App}>
        {/*<IndexRoute name="Login" component={Login}/>*/}
        {/*<Route name="Login" path="/auth" component={Login}/>*/}
        {/*<Route name="Inbox" path="/inbox"  component={Inbox}/>*/}
        <Route name="Dashboard" path="/" component={Dashboard}/>
        <Redirect from="/*" to="/"/>
    </Route>
)


function getHistory() {
    const basename = process.env.BUILD_GH_PAGES
        ? '/react-semantic.ui-starter'
        : ''
    return useBasename(() => browserHistory)({basename})
}
