import * as utils from 'v2/libs';

export interface account {
  label: string;
  address: string;
  network: string;
}

export default class AccountServiceBase {
  /*constructor () {
    address: this.address;
    label: this.label;
    network: this.network;
  }*/

  createAccount = account => {
    localStorage.setItem(`account.${utils.generateUUID()}`, JSON.stringify(account));
  };

  readAccount = (uuid: string) => {
    localStorage.getItem(`account.${uuid}`);
  };

  updateAccount = (uuid: string, account) => {
    localStorage.setItem(`account.${uuid}`, JSON.stringify(account));
  };

  deleteAccount = (uuid: string) => {
    localStorage.removeItem(`account.${uuid}`);
  };
}
