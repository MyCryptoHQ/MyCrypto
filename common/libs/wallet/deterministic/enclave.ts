import EthTx from 'ethereumjs-tx';

import EnclaveAPI, { WalletTypes } from 'shared/enclave/client';
import { translateRaw } from 'translations';
import { getTransactionFields } from 'libs/transaction';
import { IFullWallet } from '../IWallet';
import { HardwareWallet, ChainCodeResponse } from './hardware';

const walletTypeNames = {
  [WalletTypes.LEDGER]: 'X_LEDGER',
  [WalletTypes.TREZOR]: 'X_TREZOR',
  [WalletTypes.KEEPKEY]: 'X_KEEPKEY'
};

export function makeEnclaveWallet(walletType: WalletTypes) {
  class EnclaveWallet extends HardwareWallet implements IFullWallet {
    public static async getChainCode(dpath: string): Promise<ChainCodeResponse> {
      return EnclaveAPI.getChainCode({
        walletType,
        dpath
      });
    }

    constructor(address: string, dPath: string, index: number) {
      super(address, dPath, index);
    }

    public async signRawTransaction(t: EthTx): Promise<Buffer> {
      const txFields = getTransactionFields(t);
      const res = await EnclaveAPI.signTransaction({
        walletType,
        transaction: txFields,
        path: this.getPath()
      });
      return new EthTx(res.signedTransaction).serialize();
    }

    public async signMessage(msg: string): Promise<string> {
      if (!msg) {
        throw Error('No message to sign');
      }

      const res = await EnclaveAPI.signMessage({
        walletType,
        message: msg,
        path: this.getPath()
      });
      return res.signedMessage;
    }

    public async displayAddress() {
      const path = `${this.dPath}/${this.index}`;
      return EnclaveAPI.displayAddress({
        walletType,
        path
      })
        .then(res => res.success)
        .catch(() => false);
    }

    public getWalletType(): string {
      return translateRaw(walletTypeNames[walletType]);
    }
  }

  return EnclaveWallet;
}
