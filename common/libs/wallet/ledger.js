// @flow
import Ledger3 from 'vendor/ledger3';
import LedgerEth from 'vendor/ledger-eth';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix, rlp } from 'ethereumjs-util';
import DeterministicWallet from './deterministic';
import type { RawTransaction } from 'libs/transaction';
import u2f from '/vendor/u2f-api';

export default class LedgerWallet extends DeterministicWallet {
  ledger: any;
  ethApp: any;

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
    this.ledger = new Ledger3('w0w');
    this.ethApp = new LedgerEth(this.ledger);
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/uiFuncs.js#L58
  signRawTransaction(rawTx: RawTransaction): Promise<string> {
    return new Promise((resolve, reject) => {
      const eTx = new EthTx(rawTx);

      eTx.raw[6] = Buffer.from([rawTx.chainId]);
      eTx.raw[7] = 0;
      eTx.raw[8] = 0;

      this.ethApp.signTransaction(
        this.getPath(),
        rlp.encode(eTx.raw).toString('hex'),
        (result, error) => {
          if (error) {
            error = error.errorCode
              ? u2f.getErrorByCode(error.errorCode)
              : error;
            return reject(error);
          }

          const txToSerialize = {
            ...rawTx,
            v: addHexPrefix(result.v),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };

          const serializedTx = new EthTx(txToSerialize)
            .serialize()
            .toString('hex');

          resolve(addHexPrefix(serializedTx));
        }
      );
    });
  }

  // modeled after
  // https://github.com/kvhnuke/etherwallet/blob/3f7ff809e5d02d7ea47db559adaca1c930025e24/app/scripts/controllers/signMsgCtrl.js#L53
  signMessage(msg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const msgHex = Buffer.from(msg).toString('hex');

      this.ethApp.signPersonalMessage_async(
        this.getPath(),
        msgHex,
        (signed, error) => {
          if (error) {
            error = error.errorCode
              ? u2f.getErrorByCode(error.errorCode)
              : error;
            return reject(error);
          }

          const combined = signed.r + signed.s + signed.v;
          const combinedHex = combined.toString('hex');
          const signedMsg = JSON.stringify(
            {
              address: this.address,
              msg: msg,
              sig: addHexPrefix(combinedHex),
              version: '2'
            },
            null,
            2
          );

          resolve(signedMsg);
        }
      );
    });
  }
}
