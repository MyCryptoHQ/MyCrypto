// Application styles must come first in order, to allow for overrides
import 'assets/styles/etherwallet-master.less';
import 'font-awesome/scss/font-awesome.scss';
import React from 'react';
import { render } from 'react-dom';
import { Root } from './components';
import createHistory from 'history/createBrowserHistory';
import { configuredStore } from './store';
import checkBadBrowser from './utils/checkBadBrowser';
import 'sass/styles.scss';

// Check if they have a bad browser before rendering root.
if (checkBadBrowser()) {
  const el = document.getElementsByClassName('BadBrowser')[0];
  el.classList.add('is-open');
  // Dumb check for known mobile OS's. Not important to catch all, just
  // displays more appropriate information.
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    el.classList.add('is-mobile');
  }
}
else {
  const history = createHistory();

  render(
    <Root store={configuredStore} history={history} />,
    document.getElementById('app')
  );
}

if (module.hot) {
  module.hot.accept('reducers', () =>
    configuredStore.replaceReducer(require('reducers'))
  );
}
