// Application styles must come first in order, to allow for overrides
import 'assets/styles/etherwallet-master.less';
import 'font-awesome/scss/font-awesome.scss';
import React from 'react';
import { render } from 'react-dom';
import { Root } from './components';
import createHistory from 'history/createBrowserHistory';
import { configuredStore } from './store';
import 'sass/styles.scss';

const history = createHistory();

render(
  <Root store={configuredStore} history={history} />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('reducers', () =>
    configuredStore.replaceReducer(require('reducers'))
  );
}
