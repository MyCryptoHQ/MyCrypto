import BN from 'bn.js';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';
import mapValues from 'lodash/mapValues';

import { translateRaw } from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import { getTransactionFields } from 'libs/transaction';
import { padLeftEven } from 'libs/values';
import { stripHexPrefixAndLower } from 'libs/formatters';
import { HardwareWallet, ChainCodeResponse } from './hardware';

export const TREZOR_MINIMUM_FIRMWARE = '1.5.2';

export class TrezorWallet extends HardwareWallet {
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    return new Promise(resolve => {
      TrezorConnect.getXPubKey(
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
        TREZOR_MINIMUM_FIRMWARE
      );
    });
  }

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

          // check the returned signature_v and recalc signature_v if it needed
          // see also https://github.com/trezor/trezor-mcu/pull/399
          if (Number(result.v) <= 1) {
            //  for larger chainId, only signature_v returned. simply recalc signature_v
            result.v += 2 * chainId + 35;
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
    return Promise.reject(new Error('Signing via Trezor not yet supported.'));
  }

  public displayAddress(): Promise<boolean> {
    return new Promise(resolve => {
      TrezorConnect.ethereumGetAddress(
        `${this.dPath}/${this.index}`,
        res => {
          if (res.error) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        TREZOR_MINIMUM_FIRMWARE
      );
    });
  }

  public getWalletType(): string {
    return translateRaw('X_TREZOR');
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
