import EthTx, { TxObj } from 'ethereumjs-tx';
import mapValues from 'lodash/mapValues';

import { translateRaw } from 'translations';
import { getTransactionFields } from 'libs/transaction';
import { padLeftEven } from 'libs/values';
import { stripHexPrefixAndLower } from 'libs/formatters';
import { HardwareWallet, ChainCodeResponse } from './hardware';

export class SatochipWallet extends HardwareWallet {
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    return Promise.reject(new Error('getChainCode via Satochip not yet supported.'));
  }

  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return Promise.reject(new Error('Signing tx via Satochip not yet supported.'));
  }

  public signMessage() {
    return Promise.reject(new Error('Signing message via Satochip not yet supported.'));
  }

  public displayAddress(): Promise<boolean> {
    return Promise.reject(new Error('displayAddress via Satochip not yet supported.'));
  }

  public getWalletType(): string {
    return translateRaw('X_SATOCHIP');
  }

  // works, but returns a signature that can only be verified with a Trezor device
  /*
  public signMessage = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      TrezorConnect.ethereumSignMessage(
        this.getPath(),
        message,
        response => {
          if (response.success) {
            resolve(addHexPrefix(response.signature))
          } else{
            console.error(response.error)
            reject(response.error)
          }
        }
      )
    })
  }
  */
}
