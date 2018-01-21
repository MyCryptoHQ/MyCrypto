import ledger from 'ledgerco';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix, bufferToHex, toBuffer } from 'ethereumjs-util';
import { DeterministicWallet } from './deterministic';
import { getTransactionFields } from 'libs/transaction';
import { IFullWallet } from '../IWallet';
import { translateRaw } from 'translations';

export class LedgerWallet extends DeterministicWallet implements IFullWallet {
  private ethApp: any;

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
    ledger.comm_u2f.create_async().then(comm => {
      this.ethApp = new ledger.eth(comm);
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/uiFuncs.js#L58
  public signRawTransaction(t: EthTx): Promise<Buffer> {
    t.v = Buffer.from([t._chainId]);
    t.r = toBuffer(0);
    t.s = toBuffer(0);

    return new Promise((resolve, reject) => {
      this.ethApp
        .signTransaction_async(this.getPath(), t.serialize().toString('hex'))
        .then(result => {
          const strTx = getTransactionFields(t);
          const txToSerialize: TxObj = {
            ...strTx,
            v: addHexPrefix(result.v),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };

          const serializedTx = new EthTx(txToSerialize).serialize();
          resolve(serializedTx);
        })
        .catch(err => {
          return reject(Error(err + '. Check to make sure contract data is on'));
        });
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/controllers/signMsgCtrl.js#L53
  public signMessage(msg: string): Promise<string> {
    const msgHex = Buffer.from(msg).toString('hex');

    return new Promise((resolve, reject) => {
      this.ethApp.signPersonalMessage_async(this.getPath(), msgHex, async (signed, error) => {
        if (error) {
          return reject(this.ethApp.getError(error));
        }

        try {
          const combined = signed.r + signed.s + signed.v;
          resolve(bufferToHex(combined));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public displayAddress = (
    dPath?: string,
    index?: number
  ): Promise<{
    publicKey: string;
    address: string;
    chainCode?: string;
  }> => {
    if (!dPath) {
      dPath = this.dPath;
    }
    if (!index) {
      index = this.index;
    }
    return this.ethApp.getAddress_async(dPath + '/' + index, true, false);
  };

  public getWalletType(): string {
    return translateRaw('x_Ledger');
  }
}
