// Application styles must come first in order, to allow for overrides
import 'assets/styles/etherwallet-master.less';
import 'font-awesome/scss/font-awesome.scss';
import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import 'sass/styles.scss';
import { Root } from './components';
import { history, Routing } from './routing';
import { configuredStore } from './store';

const renderRoot = RouteToRender => {
  const syncedHistory = syncHistoryWithStore(history, configuredStore);
  render(
    <RouteToRender
      key={Math.random()}
      routes={Routing}
      history={syncedHistory}
      store={configuredStore}
    />,
    document.getElementById('app')
  );
};

renderRoot(Root);

if (module.hot) {
  module.hot.accept('reducers', () =>
    configuredStore.replaceReducer(require('reducers'))
  );
}
