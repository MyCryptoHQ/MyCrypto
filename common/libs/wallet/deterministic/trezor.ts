import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import { stripHexPrefixAndLower, padLeftEven } from 'libs/values';
import TrezorConnect from 'vendor/trezor-connect';
import { DeterministicWallet } from './deterministic';

import { getTransactionFields } from 'libs/transaction';
import { mapValues } from 'lodash';

import { IFullWallet } from '../IWallet';

export class TrezorWallet extends DeterministicWallet implements IFullWallet {
  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const { chainId, ...strTx } = getTransactionFields(tx);
      // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
      const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);

      (TrezorConnect as any).ethereumSignTx(
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
          const txToSerialize = {
            ...tx,
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

  // works, but returns a signature that can only be verified with a Trezor device
  /*
  public signMessage = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      (TrezorConnect as any).ethereumSignMessage(
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
