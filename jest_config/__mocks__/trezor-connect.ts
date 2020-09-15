import TrezorConnect from 'trezor-connect/lib/env/browser';

/**
 * For whatever reason Jest does not work with `trezor-connect` without mocking and exporting the browser bundle as
 * default.
 */
export default TrezorConnect;
