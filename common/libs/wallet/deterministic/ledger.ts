import Ledger3 from 'vendor/ledger3';
import LedgerEth from 'vendor/ledger-eth';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix, bufferToHex } from 'ethereumjs-util';
import { DeterministicWallet } from './deterministic';
import { IWallet } from '../IWallet';
import { ITransaction } from 'libs/transaction';

export class LedgerWallet extends DeterministicWallet implements IWallet {
  private ledger: any;
  private ethApp: any;

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
    this.ledger = new Ledger3('w0w');
    this.ethApp = new LedgerEth(this.ledger);
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/uiFuncs.js#L58
  public signRawTransaction(rawTx: ITransaction): Promise<string> {
    const eTx = new EthTx({
      ...rawTx,
      v: Buffer.from([rawTx.chainId]),
      r: 0,
      s: 0
    });

    return new Promise((resolve, reject) => {
      this.ethApp.signTransaction(
        this.getPath(),
        eTx.serialize().toString('hex'),
        (result, error) => {
          if (error) {
            return reject(this.ethApp.getError(error));
          }

          const txToSerialize = {
            ...rawTx,
            v: addHexPrefix(result.v),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };

          const serializedTx = new EthTx(txToSerialize).serialize();

          resolve(bufferToHex(serializedTx));
        }
      );
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/controllers/signMsgCtrl.js#L53
  public signMessage(msg: string): Promise<string> {
    const msgHex = Buffer.from(msg).toString('hex');

    return new Promise((resolve, reject) => {
      this.ethApp.signPersonalMessage_async(
        this.getPath(),
        msgHex,
        async (signed, error) => {
          if (error) {
            return reject(this.ethApp.getError(error));
          }

          try {
            const combined = signed.r + signed.s + signed.v;
            resolve(bufferToHex(combined));
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
}
