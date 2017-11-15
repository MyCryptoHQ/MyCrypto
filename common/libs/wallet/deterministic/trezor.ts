import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import { RawTransaction } from 'libs/transaction';
import { stripHexPrefixAndLower } from 'libs/values';
import TrezorConnect from 'vendor/trezor-connect';
import { DeterministicWallet } from './deterministic';
import { IWallet } from '../IWallet';

export class TrezorWallet extends DeterministicWallet implements IWallet {
  public signRawTransaction(tx: RawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      (TrezorConnect as any).ethereumSignTx(
        // Args
        this.getPath(),
        // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
        stripHexPrefixAndLower(tx.nonce),
        stripHexPrefixAndLower(tx.gasPrice.toString()),
        stripHexPrefixAndLower(tx.gasLimit.toString()),
        stripHexPrefixAndLower(tx.to),
        stripHexPrefixAndLower(tx.value),
        stripHexPrefixAndLower(tx.data),
        tx.chainId,
        // Callback
        result => {
          if (!result.success) {
            return reject(new Error(result.error));
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
          const signedTx = addHexPrefix(eTx.serialize().toString('hex'));
          resolve(signedTx);
        }
      );
    });
  }

  public signMessage = () =>
    Promise.reject(new Error('Signing via Trezor not yet supported.'));

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
