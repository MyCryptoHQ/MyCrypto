// @flow

import EthTx from 'ethereumjs-tx';
import { sha3, ecsign } from 'ethereumjs-util';
import { isValidRawTx } from 'libs/validators';
import type { RawTransaction } from 'libs/transaction';

export function signRawTxWithPrivKey(
  privKey: Buffer,
  rawTx: RawTransaction
): string {
  if (!isValidRawTx(rawTx)) {
    throw new Error('Invalid raw transaction');
  }

  let eTx = new EthTx(rawTx);
  eTx.sign(privKey);
  return '0x' + eTx.serialize().toString('hex');
}

export function signMessageWithPrivKey(
  privKey: Buffer,
  msg: string,
  address: string,
  date: string
): string {
  let spacer = msg.length > 0 && date.length > 0 ? ' ' : '';
  let fullMessage = msg + spacer + date;
  let hash = sha3(fullMessage);
  let signed = ecsign(hash, privKey);
  let combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  let combinedHex = combined.toString('hex');

  return JSON.stringify({
    address: address,
    msg: fullMessage,
    sig: '0x' + combinedHex
  });
}
