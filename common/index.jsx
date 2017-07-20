// Application styles
import 'assets/styles/etherwallet-master.less';

// Static icons
import 'assets/images/icons/icon16.png';

import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';

import { Root } from 'components';
import { Routing, history } from './routing';
import { store } from './store';

const renderRoot = Root => {
  let syncedHistory = syncHistoryWithStore(history, store);
  render(
    <Root
      key={Math.random()}
      routes={Routing}
      history={syncedHistory}
      store={store}
    />,
    document.getElementById('app')
  );
};

renderRoot(Root);

if (module.hot) {
  module.hot.accept('reducers/index', () =>
    store.replaceReducer(require('reducers/index').default)
  );
}
