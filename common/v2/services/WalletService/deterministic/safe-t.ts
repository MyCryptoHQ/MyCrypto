import BN from 'bn.js';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import mapValues from 'lodash/mapValues';

import { translateRaw } from 'v2/translations';
import SafeTConnect from 'vendor/safe-t-connect';
import { getTransactionFields } from 'v2/services/EthService';
import { padLeftEven, stripHexPrefixAndLower } from 'v2/services/EthService/utils';
import { HardwareWallet, ChainCodeResponse } from './hardware';

export const SAFE_T_MINIMUM_FIRMWARE = '1.0.0';

export class SafeTWallet extends HardwareWallet {
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    return new Promise(resolve => {
      SafeTConnect.getXPubKey(
        dpath,
        res => {
          if (res.success) {
            resolve({
              publicKey: res.publicKey,
              chainCode: res.chainCode
            });
          } else {
            throw new Error(res.error);
          }
        },
        SAFE_T_MINIMUM_FIRMWARE
      );
    });
  }

  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const { chainId, ...strTx } = getTransactionFields(tx);
      // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
      const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);

      SafeTConnect.ethereumSignTx(
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
            r: addHexPrefix(result.r.toString()),
            s: addHexPrefix(result.s)
          };
          const eTx = new EthTx(txToSerialize);
          const serializedTx = eTx.serialize();
          resolve(serializedTx);
        }
      );
    });
  }

  public signMessage() {
    return Promise.reject(new Error('Signing via Safe-T mini not yet supported.'));
  }

  public displayAddress(): Promise<boolean> {
    return new Promise(resolve => {
      SafeTConnect.ethereumGetAddress(
        `${this.dPath}/${this.index}`,
        res => {
          if (res.error) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        SAFE_T_MINIMUM_FIRMWARE
      );
    });
  }

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
