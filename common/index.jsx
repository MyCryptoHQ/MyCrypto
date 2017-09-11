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

const renderRoot = Root => {
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
