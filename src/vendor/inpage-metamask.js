import LocalMessageDuplexStream from 'post-message-stream';
import MetamaskInpageProvider from '@metamask/inpage-provider';

// Firefox Metamask Hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133

(() => {
  if (!window.ethereum && !window.web3 && navigator.userAgent.includes('Firefox')) {
    // setup background connection
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'inpage',
      target: 'contentscript'
    });

    // compose the inpage provider
    const inpageProvider = new MetamaskInpageProvider(metamaskStream);

    // set a high max listener count to avoid unnecesary warnings
    inpageProvider.setMaxListeners(100);

    // Work around for web3@1.0 deleting the bound `sendAsync` but not the unbound
    // `sendAsync` method on the prototype, causing `this` reference issues
    const ethereum = new Proxy(inpageProvider, {
      // straight up lie that we deleted the property so that it doesnt
      // throw an error in strict mode
      deleteProperty: () => true
    });

    window.ethereum = ethereum;
  }
})();
