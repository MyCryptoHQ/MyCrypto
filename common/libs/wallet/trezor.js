// @flow
import BaseWallet from './base';
import Trezor from 'trezor.js';

export default class TrezorWallet extends BaseWallet {
  device = null;

  constructor() {
    super();
  }
}
