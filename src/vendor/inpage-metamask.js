import { initProvider } from '@metamask/inpage-provider';
import LocalMessageDuplexStream from 'post-message-stream';

// Firefox Metamask Hack
// Due to https://github.com/MetaMask/metamask-extension/issues/3133

(() => {
  //debugger;
  var consolere = {
    channel: 'try-1dbb-acac-eb23',
    api: '//console.re/connector.js',
    ready: function (c) {
      var d = document,
        s = d.createElement('script'),
        l;
      s.src = this.api;
      s.id = 'consolerescript';
      s.onreadystatechange = s.onload = function () {
        if (!l) {
          c();
        }
        l = true;
      };
      d.getElementsByTagName('head')[0].appendChild(s);
    }
  };

  consolere.ready(() => {
    // eslint-disable-next-line no-global-assign
    console = console.re;
    console.re.log('remote log test');
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
