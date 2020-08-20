// Application styles must come first in order, to allow for overrides
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';
import '@babel/polyfill';

import 'whatwg-fetch'; // @todo: Investigate utility of dependency
import 'what-input'; // @todo: Investigate utility of dependency; Used in sass/styles.scss for `data-whatintent`

import React from 'react';
import { render } from 'react-dom';

import { consoleAdvertisement, IS_STAGING, IS_PROD, getRootDomain } from '@utils';

import Root from './Root';

/**
 * We use an iframe to migrate user storage from landing to app ie. <MigrateLS/>.
 * 1. Since an origin is defined as `<protocol>://<host>:<port>` and the websites have different sub-domains,
 *    we need a cross-origin iframe.
 *    https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
 * 2. By setting `document.domain` in both app and landing, the browser will consider them as having the same-origin.
 *    https://javascript.info/cross-window-communication#windows-on-subdomains-document-domain
 * 3. Even if the value is identical to `location.hostname` we need to explicitly set it
 *    in order to set the port part of origin to null.
 *     https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)
 * 4. Since we need run 3 environments we dynamically set the domain to the appropriate hostname.
 */
document.domain = getRootDomain(document.location.hostname);

// disables drag-and-drop due to potential security issues by Cure53 recommendation
const doNothing = (event: DragEvent) => {
  event.preventDefault();
  return false;
};
document.addEventListener('dragover', doNothing, false);
document.addEventListener('drop', doNothing, false);

render(<Root />, document.getElementById('app'));

if (IS_PROD || IS_STAGING) {
  consoleAdvertisement();
}
