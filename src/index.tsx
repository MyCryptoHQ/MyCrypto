// Application styles must come first in order, to allow for overrides
import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';

import 'whatwg-fetch'; // @todo: Investigate utility of dependency
import 'what-input'; // @todo: Investigate utility of dependency; Used in sass/styles.scss for `data-whatintent`

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { FeatureFlagProvider } from '@services';
import { createStore } from '@store';
import { consoleAdvertisement, getRootDomain, IS_DEV, IS_E2E } from '@utils';
import { ethereumMock } from '@vendor';

/**
 * Ensure landing and app have the same domain to handle cross-origin policy.
 * 1. Since an origin is defined as `<protocol>://<host>:<port>` and the websites have different sub-domains,
 *    we need a cross-origin iframe.
 *    https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
 * 2. By setting `document.domain` in both app and landing, the browser will consider them as having the same-origin.
 *    https://javascript.info/cross-window-communication#windows-on-subdomains-document-domain
 * 3. Even if the value is identical to `location.hostname` we need to explicitly set it
 *    in order to set the port part of origin to null.
 *     https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)
 * 4. Since we run 3 environments we dynamically set the domain to the appropriate hostname.
 */
document.domain = getRootDomain(document.location.hostname);

// disables drag-and-drop due to potential security issues by Cure53 recommendation
const doNothing = (event: DragEvent) => {
  event.preventDefault();
  return false;
};
document.addEventListener('dragover', doNothing, false);
document.addEventListener('drop', doNothing, false);

if (IS_E2E) {
  // ONLY FOR TESTING
  (window as CustomWindow).ethereum = ethereumMock();
}

if (!IS_DEV) {
  consoleAdvertisement();
}

const { store, persistor } = createStore();

export const render = () => {
  /* eslint-disable-next-line  @typescript-eslint/no-var-requires */
  const App = require('./App').default;
  ReactDOM.render(
    <Provider store={store}>
      <FeatureFlagProvider>
        <PersistGate persistor={persistor}>
          {(isHydrated: boolean) => <App storeReady={isHydrated} />}
        </PersistGate>
      </FeatureFlagProvider>
    </Provider>,
    document.getElementById('root')
  );
};

render();

if (IS_DEV && module.hot) {
  module.hot.accept('./App', render);
}
