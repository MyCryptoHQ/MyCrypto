// Application styles must come first in order, to allow for overrides
import 'assets/styles/etherwallet-master.less';
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
import createHistory from 'history/createBrowserHistory';
import { configuredStore } from './store';

const history = createHistory();

const appEl = document.getElementById('app');

render(<Root store={configuredStore} history={history} />, appEl);

if (module.hot) {
  module.hot.accept('reducers', () =>
    configuredStore.replaceReducer(require('reducers'))
  );

  module.hot.accept('./Root', () => {
    render(<Root store={configuredStore} history={history} />, appEl);
  });
}
