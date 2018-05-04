import ledger from 'ledgerco';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';
import { HardwareWallet, ChainCodeResponse } from './hardware';
import { getTransactionFields } from 'libs/transaction';
import { IFullWallet } from '../IWallet';
import { translateRaw } from 'translations';
import EnclaveAPI, { WalletTypes } from 'shared/enclave/client';

export class LedgerWallet extends HardwareWallet implements IFullWallet {
  public static async getChainCode(dpath: string): Promise<ChainCodeResponse> {
    if (process.env.BUILD_ELECTRON) {
      return EnclaveAPI.getChainCode({
        walletType: WalletTypes.LEDGER,
        dpath
      });
    }

    return makeApp()
      .then(app => app.getAddress_async(dpath, false, true))
      .then(res => {
        return {
          publicKey: res.publicKey,
          chainCode: res.chainCode
        };
      })
      .catch((err: any) => {
        throw new Error(ledgerErrToMessage(err));
      });
  }

  private ethApp: ledger.eth;

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
    makeApp().then(app => (this.ethApp = app));
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/uiFuncs.js#L58
  public async signRawTransaction(t: EthTx): Promise<Buffer> {
    const txFields = getTransactionFields(t);

    if (process.env.BUILD_ELECTRON) {
      const res = await EnclaveAPI.signTransaction({
        walletType: WalletTypes.LEDGER,
        transaction: txFields,
        path: this.getPath()
      });
      return new EthTx(res.signedTransaction).serialize();
    }

    t.v = Buffer.from([t._chainId]);
    t.r = toBuffer(0);
    t.s = toBuffer(0);

    try {
      const result = await this.ethApp.signTransaction_async(
        this.getPath(),
        t.serialize().toString('hex')
      );

      const txToSerialize: TxObj = {
        ...txFields,
        v: addHexPrefix(result.v),
        r: addHexPrefix(result.r),
        s: addHexPrefix(result.s)
      };

      return new EthTx(txToSerialize).serialize();
    } catch (err) {
      throw Error(err + '. Check to make sure contract data is on');
    }
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/controllers/signMsgCtrl.js#L53
  public async signMessage(msg: string): Promise<string> {
    const msgHex = Buffer.from(msg).toString('hex');
    try {
      const signed = await this.ethApp.signPersonalMessage_async(this.getPath(), msgHex);
      const combined = addHexPrefix(signed.r + signed.s + signed.v.toString(16));
      return combined;
    } catch (error) {
      throw (this.ethApp as any).getError(error);
    }
  }

  public displayAddress() {
    return this.ethApp
      .getAddress_async(this.dPath + '/' + this.index, true, false)
      .then(() => true)
      .catch(() => false);
  }

  public getWalletType(): string {
    return translateRaw('X_LEDGER');
  }
}

function makeApp(): Promise<ledger.eth> {
  return ledger.comm_u2f.create_async().then((comm: any) => new ledger.eth(comm));
}

function ledgerErrToMessage(err: any) {
  // Timeout
  if (err && err.metaData && err.metaData.code === 5) {
    return translateRaw('LEDGER_TIMEOUT');
  }
  // Wrong app logged into
  if (err && err.includes && err.includes('6804')) {
    return translateRaw('LEDGER_WRONG_APP');
  }
  // Ledger locked
  if (err && err.includes && err.includes('6801')) {
    return translateRaw('LEDGER_LOCKED');
  }
  // Other
  return err && err.metaData ? err.metaData.type : err.toString();
}
