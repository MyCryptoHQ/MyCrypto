import React from 'react'
import {render} from 'react-dom'
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import Perf from 'react-addons-perf'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import RootReducer from './reducers'
import {Root} from 'components'
import {Routing, history} from './routing'
// application styles
import 'assets/styles/etherwallet-master.less'


const configureStore = () => {
    let middleware = applyMiddleware(routerMiddleware(history));
    let thunkApplied = applyMiddleware(thunk)
    if (process.env.NODE_ENV !== 'production') {
        window.Perf = Perf
        thunkApplied = composeWithDevTools(thunkApplied)
    }
    let store = createStore(RootReducer, thunkApplied, middleware);
    return store
};

const renderRoot = (Root) => {
    let store = configureStore();
    let syncedHistory = syncHistoryWithStore(history, store);
    render(
        <Root key={Math.random()} routes={Routing} history={syncedHistory}
              store={store}/>, document.getElementById('app'))
};

renderRoot(Root);

if (module.hot) {
    module.hot.accept()
}
