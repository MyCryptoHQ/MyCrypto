const trezorConnect = jest.requireActual('trezor-connect/lib/env/browser/index.js');

/**
 * For whatever reason Jest does not work with `trezor-connect` without mocking and exporting the browser bundle as
 * default.
 */
export default {
  ...trezorConnect
};
