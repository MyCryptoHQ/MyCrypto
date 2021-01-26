import { initProvider } from '@metamask/inpage-provider';
import LocalMessageDuplexStream from 'post-message-stream';

// Firefox Metamask Hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133

(() => {
  // eslint-disable-next-line no-global-assign
  //console = console.re;
  //console.re.log('remote log test');

  window.addEventListener('error', function (event) {
    if (console.re) {
      console.re.log(event);
    }
  });

  if (!window.ethereum && !window.web3 && navigator.userAgent.includes('Firefox')) {
    // setup background connection
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'inpage',
      target: 'contentscript'
    });

    // this will initialize the provider and set it as window.ethereum
    initProvider({
      connectionStream: metamaskStream
    });
  }
})();
