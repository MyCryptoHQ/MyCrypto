// Application styles must come first in order, to allow for overrides
import 'assets/styles/etherwallet-master.less';
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';

import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';

import { Root } from 'components';
import { history } from './routing';
import { store } from './store';
import checkBadBrowser from './utils/checkBadBrowser';

const renderRoot = Root => {
  // Check if they have a bad browser before rendering root.
  if (checkBadBrowser()) {
    const el = document.getElementsByClassName('BadBrowser')[0];
    el.classList.add('is-open');
    // Dumb check for known mobile OS's. Not important to catch all, just
    // displays more appropriate information.
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      el.classList.add('is-mobile');
    }
    return;
  }

  let syncedHistory = syncHistoryWithStore(history, store);
  render(
    <Root history={syncedHistory} store={store} />,
    document.getElementById('app')
  );
};

renderRoot(Root);

if (module.hot) {
  module.hot.accept('reducers/index', () =>
    store.replaceReducer(require('reducers/index').default)
  );
  module.hot.accept();
}
