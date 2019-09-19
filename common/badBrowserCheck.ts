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
  if (!Modernizr[feature]) {
    const element = document.getElementsByClassName('BadBrowser')[0];
    element.className += ' is-open';

    console.log(`Feature '${feature}' not supported.`);

    return false;
  }

  return true;
};

document.addEventListener('DOMContentLoaded', () => {
  features.every(isSupported);
});
