// @flow

export default class BaseWallet {
  getAddress(): Promise<any> {
    return Promise.reject('Implement me');
  }

  getNakedAddress(): Promise<any> {
    return new Promise(resolve => {
      this.getAddress.then(address => {
        resolve(address.replace('0x', '').toLowerCase());
      });
    });
  }
}
