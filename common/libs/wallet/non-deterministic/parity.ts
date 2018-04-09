import { IFullWallet } from '../IWallet';

export const wikiLink = 'https://wiki.parity.io/Parity-Signer-Mobile-App-MyCrypto-tutorial';

export default class ParitySignerWallet implements IFullWallet {
  public address: string;

  constructor(address: string) {
    this.address = address;
  }

  public signRawTransaction = () =>
    Promise.reject(new Error('Web3 wallets cannot sign raw transactions.'));

  public signMessage = () =>
    Promise.reject(new Error('Signing via Parity Signer not yet supported.'));

  public getAddressString() {
    return this.address;
  }
}
