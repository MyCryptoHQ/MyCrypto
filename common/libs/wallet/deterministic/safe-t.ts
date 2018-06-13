import BN from 'bn.js';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import { stripHexPrefixAndLower, padLeftEven } from 'libs/values';
import SafeTConnect from 'vendor/safe-t-connect';
import { DeterministicWallet } from './deterministic';
import { getTransactionFields } from 'libs/transaction';
import mapValues from 'lodash/mapValues';

import { IFullWallet } from '../IWallet';
import { translateRaw } from 'translations';

export const SAFE_T_MINIMUM_FIRMWARE = '1.5.2';

export class SafeTWallet extends DeterministicWallet implements IFullWallet {
  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const { chainId, ...strTx } = getTransactionFields(tx);
      // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
      const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);

      (SafeTConnect as any).ethereumSignTx(
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
        (result: any) => {
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

  public signMessage = () =>
    Promise.reject(new Error('Signing via Safe-T mini not yet supported.'));

  public displayAddress = (dPath?: string, index?: number): Promise<any> => {
    if (!dPath) {
      dPath = this.dPath;
    }
    if (!index) {
      index = this.index;
    }

    return new Promise((resolve, reject) => {
      (SafeTConnect as any).ethereumGetAddress(
        dPath + '/' + index,
        (res: any) => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(res);
          }
        },
        SAFE_T_MINIMUM_FIRMWARE
      );
    });
  };

  public getWalletType(): string {
    return translateRaw('X_SAFE_T');
  }

  // works, but returns a signature that can only be verified with a Safe-T mini device
  /*
  public signMessage = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      SafeTConnect.ethereumSignMessage(
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
