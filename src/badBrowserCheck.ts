import Modernizr from 'modernizr';

const features: (keyof typeof Modernizr)[] = ['flexbox', 'flexwrap', 'localstorage'];

/**
 * Checks for browser support in the specified feature. If the feature is not supported, the `BadBrowser` overlay will
 * be shown.
 *
 * @param feature
 * @return {boolean}
 */
const isSupported = (feature: keyof typeof Modernizr): boolean => {
  if (Modernizr[feature]) {
    return true;
  }

  const element = document.getElementsByClassName('BadBrowser')[0];
  element.className += ' is-open';

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    element.className += ' is-mobile';
  }

  console.warn(`Feature '${feature}' not supported.`);

  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  features.every(isSupported);
});

// Firefox Metamask Hack
(() => {
  if (!window.ethereum && !window.web3 && navigator.userAgent.includes('Firefox')) {
    const script = document.createElement('script');
    script.src = './inpage-metamask.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
})();
