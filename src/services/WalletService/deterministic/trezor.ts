import { Transaction as EthTx, TxData } from 'ethereumjs-tx';
import mapValues from 'lodash/mapValues';

import { translateRaw } from '@translations';
import TrezorConnect from 'trezor-connect';
import { getTransactionFields } from '@services/EthService';
import { stripHexPrefixAndLower, padLeftEven } from '@services/EthService/utils';
import { HardwareWallet, ChainCodeResponse } from './hardware';

// read more: https://github.com/trezor/connect/blob/develop/docs/index.md#trezor-connect-manifest
TrezorConnect.manifest({
  email: 'support@mycrypto.com',
  appUrl: 'https://mycrypto.com/'
});

export class TrezorWallet extends HardwareWallet {
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    return new Promise((resolve) => {
      TrezorConnect.getPublicKey({
        path: dpath
      }).then((res) => {
        if (res.success) {
          resolve({
            publicKey: res.payload.publicKey,
            chainCode: res.payload.chainCode
          });
        } else {
          throw new Error(`[TrezorConnect] Error: ${res.id}`);
        }
      });
    });
  }

  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const { chainId, ...strTx } = getTransactionFields(tx);
      // stripHexPrefixAndLower identical to ethFuncs.getNakedAddress
      const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);
      TrezorConnect.ethereumSignTransaction({
        path: this.getPath(),
        transaction: {
          nonce: cleanedTx.nonce,
          gasPrice: cleanedTx.gasPrice,
          gasLimit: cleanedTx.gasLimit,
          to: cleanedTx.to,
          value: cleanedTx.value,
          data: cleanedTx.data,
          chainId
        }
      }).then((res: any) => {
        if (!res.success) {
          return reject(Error(res.error));
        }
        // check the returned signature_v and recalc signature_v if it needed
        // see also https://github.com/trezor/trezor-mcu/pull/399
        if (Number(res.payload.v) <= 1) {
          //  for larger chainId, only signature_v returned. simply recalc signature_v
          res.payload.v += 2 * chainId + 35;
        }

        // @todo: Explain what's going on here? Add tests? Adapted from:
        // https://github.com/kvhnuke/etherwallet/blob/v3.10.2.6/app/scripts/uiFuncs.js#L24
        const txToSerialize: TxData = {
          ...strTx,
          v: res.payload.v,
          r: res.payload.r,
          s: res.payload.s
        };
        const eTx = new EthTx(txToSerialize, { chain: chainId });
        const serializedTx = eTx.serialize();
        resolve(serializedTx);
      });
    });
  }

  public async signMessage(message: string): Promise<string> {
    if (!message) {
      throw Error('No message to sign');
    }

    const response = await TrezorConnect.ethereumSignMessage({
      message,
      path: this.getPath()
    });

    if (!response.success) {
      throw Error('Failed to sign message');
    }

    return response.payload.signature;
  }

  public displayAddress(): Promise<boolean> {
    return new Promise((resolve) => {
      TrezorConnect.ethereumGetAddress({
        path: `${this.dPath}/${this.index}`
      }).then((res: any) => {
        if (!res.success) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
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
