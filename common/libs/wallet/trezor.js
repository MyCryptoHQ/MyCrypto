// @flow
import TrezorConnect from 'vendor/trezor-connect';
import EthTx from 'ethereumjs-tx';
import Big from 'bignumber.js';
import { addHexPrefix } from 'ethereumjs-util';
import DeterministicWallet from './deterministic';
import { stripHex } from 'libs/values';

import type { RawTransaction } from 'libs/transaction';

export default class TrezorWallet extends DeterministicWallet {
  signRawTransaction(tx: RawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      TrezorConnect.ethereumSignTx(
        // Args
        this.getPath(),
        stripHex(tx.nonce),
        stripHex(tx.gasPrice.toString()),
        stripHex(tx.gasLimit.toString()),
        stripHex(tx.to),
        stripHex(tx.value),
        stripHex(tx.data),
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
            v: addHexPrefix(new Big(result.v).toString(16)),
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
}
