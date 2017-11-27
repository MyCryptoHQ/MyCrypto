import { IFullWallet } from '../IWallet';
import { ExtendedRawTransaction } from 'libs/transaction';
import { networkIdToName } from 'libs/values';
import { bufferToHex } from 'ethereumjs-util';

export default class Web3Wallet implements IFullWallet {
  private web3: any;
  private address: string;
  private network: string;

  constructor(web3: any, address: string, network: string) {
    this.web3 = web3;
    this.address = address;
    this.network = network;
  }

  public getAddressString(): Promise<string> {
    return Promise.resolve(this.address);
  }

  public signRawTransaction(): Promise<string> {
    return Promise.reject(
      new Error('Web3 wallets cannot sign raw transactions.')
    );
  }

  public signMessage(msg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const msgHex = bufferToHex(Buffer.from(msg));
      const options = {
        method: 'personal_sign',
        params: [msgHex, this.address],
        signingAddr: this.address
      };

      this.web3.currentProvider.sendAsync(options, (err, data) => {
        if (err) {
          return reject(err);
        }

        if (data.error) {
          return reject(data.error);
        }
        resolve(data.result);
      });
    });
  }

  public sendTransaction(transaction: ExtendedRawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      const { from, to, value, gasLimit, gasPrice, data, nonce } = transaction;

      const web3Tx = {
        from,
        to,
        value,
        gas: gasLimit,
        gasPrice,
        data,
        nonce
      };

      // perform sanity check to ensure network hasn't changed
      this.web3.version.getNetwork((err1, networkId) => {
        const networkName = networkIdToName(networkId);

        if (err1) {
          return reject(err1);
        }

        if (this.network !== networkName) {
          return reject(
            new Error(
              `Expected MetaMask / Mist network to be ${
                this.network
              }, but got ${networkName}. ` +
                `Please change the network or restart MyEtherWallet.`
            )
          );
        }

        // execute transaction
        this.web3.eth.sendTransaction(web3Tx, (err2, txHash) => {
          if (err2) {
            return reject(err2);
          }
          resolve(txHash);
        });
      });
    });
  }
}
