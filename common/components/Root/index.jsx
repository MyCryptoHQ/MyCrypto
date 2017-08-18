import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// Props that come in to Root are almost exclusively complex objects from libraries.
type Props = {
  store: mixed,
  history: mixed,
  routes: mixed
};

export default class Root extends Component {
  props: Props;

  render() {
    const { store, history, routes } = this.props;
    console.log(store, history, routes);
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
