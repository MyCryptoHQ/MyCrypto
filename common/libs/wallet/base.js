// @flow

export default class BaseWallet {
  getAddress(): string {
    throw 'Implement me';
  }

  getNakedAddress(): string {
    return this.getAddress().replace('0x', '').toLowerCase();
  }
}
