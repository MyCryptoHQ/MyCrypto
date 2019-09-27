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
