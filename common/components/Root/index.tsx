import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// TODO: fix this
interface Props {
  store: any;
  history: any;
  routes(): null;
}

export default class Root extends Component<Props, {}> {
  public render() {
    const { store, history, routes } = this.props;
    // key={Math.random()} = hack for HMR from https://github.com/webpack/webpack-dev-server/issues/395
    return (
      <Provider store={store} key={Math.random()}>
        <Router history={history} key={Math.random()}>
          {routes()}
        </Router>
      </Provider>
    );
  }
}
