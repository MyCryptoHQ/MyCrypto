import BN from 'bn.js';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import { stripHexPrefixAndLower, padLeftEven } from 'libs/values';
import TrezorConnect from 'vendor/trezor-connect';
import { DeterministicWallet } from './deterministic';
import { getTransactionFields } from 'libs/transaction';
import mapValues from 'lodash/mapValues';

import { IFullWallet } from '../IWallet';
import { translateRaw } from 'translations';

export class TrezorWallet extends DeterministicWallet implements IFullWallet {
  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const { chainId, ...strTx } = getTransactionFields(tx);
      // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
      const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);

      TrezorConnect.ethereumSignTx(
        // Args
        this.getPath(),
        cleanedTx.nonce,
        cleanedTx.gasPrice,
        cleanedTx.gasLimit,
        cleanedTx.to,
        cleanedTx.value,
        cleanedTx.data,
        chainId,
        // Callback
        result => {
          if (!result.success) {
            return reject(Error(result.error));
          }

          // TODO: Explain what's going on here? Add tests? Adapted from:
          // https://github.com/kvhnuke/etherwallet/blob/v3.10.2.6/app/scripts/uiFuncs.js#L24
          const txToSerialize: TxObj = {
            ...strTx,
            v: addHexPrefix(new BN(result.v).toString(16)),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };
          const eTx = new EthTx(txToSerialize);
          const serializedTx = eTx.serialize();
          resolve(serializedTx);
        }
      );
    });
  }

  public signMessage = () => Promise.reject(new Error('Signing via Trezor not yet supported.'));

  // trezor-connect.js doesn't provide the promise return type
  public displayAddress = (dPath?: string, index?: number): Promise<any> => {
    if (!dPath) {
      dPath = this.dPath;
    }
    if (!index) {
      index = this.index;
    }
    return TrezorConnect.ethereumGetAddress(dPath + '/' + index);
  };

  public getWalletType(): string {
    return translateRaw('x_Trezor');
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
