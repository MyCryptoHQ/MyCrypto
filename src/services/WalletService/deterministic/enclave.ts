import { Transaction as EthTx } from 'ethereumjs-tx';

import EnclaveAPI, { WalletTypes } from 'shared/enclave/client';
import { translateRaw } from '@translations';
import { getTransactionFields } from '@services/EthService';
import { IFullWallet } from '../IWallet';
import { HardwareWallet, ChainCodeResponse } from './hardware';

const walletTypeNames = {
  [WalletTypes.LEDGER]: 'X_LEDGER',
  [WalletTypes.TREZOR]: 'X_TREZOR',
  [WalletTypes.SATOCHIP]: 'X_SATOCHIP',
  [WalletTypes.KEEPKEY]: 'X_KEEPKEY'
};

export function makeEnclaveWallet(walletType: WalletTypes) {
  class EnclaveWallet extends HardwareWallet implements IFullWallet {
    public static async getChainCode(dpath: string): Promise<ChainCodeResponse> {
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in getChainCode()'
      ); //debugSatochip
      return EnclaveAPI.getChainCode({
        walletType,
        dpath
      });
    }

    constructor(address: string, dPath: string, index: number) {
      super(address, dPath, index);
    }

    public async signRawTransaction(tx: EthTx): Promise<Buffer> {
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in signRawTransaction()'
      ); //debugSatochip
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: tx.getChainId()= ',
        tx.getChainId()
      ); //debugSatochip
      // Disable EIP155 in Ethereumjs-tx since it conflicts with Ledger
      const txFieldsBefore = getTransactionFields(tx); //debugSatochip
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: txFieldsBefore= ',
        txFieldsBefore
      ); //debugSatochip
      const t =
        walletType === WalletTypes.SATOCHIP //|| WalletTypes.SATOCHIP
          ? new EthTx(tx, { chain: tx.getChainId(), hardfork: 'tangerineWhistle' })
          : tx;
      const txFields = getTransactionFields(t);
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: t.getChainId()= ',
        t.getChainId()
      ); //debugSatochip
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: txFields= ',
        txFields
      ); //debugSatochip
      const res = await EnclaveAPI.signTransaction({
        walletType,
        transaction: txFields,
        path: this.getPath()
      });
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in signRawTransaction() after EnclaveAPI.signTransaction'
      ); //debugSatochip
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in signRawTransaction() res.signedTransaction= ',
        res.signedTransaction
      ); //debugSatochip
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in signRawTransaction() return= ',
        new EthTx(res.signedTransaction, {
          chain: tx.getChainId(),
          hardfork: 'tangerineWhistle'
        }).serialize()
      ); //debugSatochip
      return new EthTx(res.signedTransaction, {
        chain: tx.getChainId(),
        hardfork: 'tangerineWhistle'
      }).serialize();
      // return new EthTx(res.signedTransaction).serialize();
    }

    public async signMessage(msg: string): Promise<string> {
      console.log(
        'Satochip: /src/services/WalletService/deterministic/enclave.ts: in signMessage()'
      ); //debugSatochip
      console.log('Satochip: /src/services/WalletService/deterministic/enclave.ts: msg= ', msg); //debugSatochip
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
        .then((res) => res.success)
        .catch(() => false);
    }

    public getWalletType(): string {
      return translateRaw(walletTypeNames[walletType]);
    }
  }

  return EnclaveWallet;
}
