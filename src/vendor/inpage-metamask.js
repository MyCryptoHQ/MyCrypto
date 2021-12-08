import { initializeProvider } from '@metamask/inpage-provider';
import { WindowPostMessageStream } from '@metamask/post-message-stream';

import { injectMobile } from './inpage-metamask-mobile';

// Metamask injection hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133

(() => {
  if (window.ethereum || window.web3) {
    return;
  }
  if (navigator.userAgent.includes('Firefox')) {
    // setup background connection
    const metamaskStream = new WindowPostMessageStream({
      name: 'metamask-inpage',
      target: 'metamask-contentscript'
    });

    // this will initialize the provider and set it as window.ethereum
    initializeProvider({
      connectionStream: metamaskStream,
      shouldShimWeb3: true
    });
  } else if (navigator.userAgent.includes('iPhone')) {
    injectMobile();
  }
})();
