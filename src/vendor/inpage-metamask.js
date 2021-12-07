import { initializeProvider } from '@metamask/inpage-provider';
import LocalMessageDuplexStream from 'post-message-stream';

import { injectMobile } from './inpage-metamask-mobile';

// Firefox Metamask Hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133

(() => {
  if (window.ethereum || window.web3) {
    return;
  }
  if (navigator.userAgent.includes('Firefox')) {
    // setup background connection
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'inpage',
      target: 'contentscript'
    });

    // this will initialize the provider and set it as window.ethereum
    initializeProvider({
      connectionStream: metamaskStream
    });
  } else if (navigator.userAgent.includes('iPhone')) {
    injectMobile();
  }
})();
