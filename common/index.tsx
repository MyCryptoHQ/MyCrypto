// Application styles must come first in order, to allow for overrides
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';
import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';

import Root from './Root';
import consoleAdvertisement from 'utils/consoleAdvertisement';
import configuredStore from 'features/store';

const appEl = document.getElementById('app');

render(<Root store={configuredStore} />, appEl);

if (module.hot) {
  module.hot.accept('features/reducers', () =>
    configuredStore.replaceReducer(require('features/reducers'))
  );

  module.hot.accept('./Root', () => {
    render(<Root store={configuredStore} />, appEl);
  });
}

if (process.env.NODE_ENV === 'production') {
  consoleAdvertisement();
}

const noOp = (event: DragEvent) => {
  event.preventDefault();
  return false;
};

// disables drag-and-drop due to potential security issues by Cure53 recommendation
document.addEventListener('dragover', noOp, false);
document.addEventListener('drop', noOp, false);
