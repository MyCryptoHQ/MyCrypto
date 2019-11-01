// Application styles must come first in order, to allow for overrides
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';
import '@babel/polyfill';

import 'whatwg-fetch'; // @TODO: Investigate utility of dependency
import 'what-input'; // @TODO: Investigate utility of dependency

import React from 'react';
import { render } from 'react-dom';

import { consoleAdvertisement } from 'v2/utils';

import Root from './Root';

render(<Root />, document.getElementById('app'));

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
