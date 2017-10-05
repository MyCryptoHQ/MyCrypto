import EthTx from 'ethereumjs-tx';
import { ecsign, sha3 } from 'ethereumjs-util';
import { RawTransaction } from 'libs/transaction';
import { isValidRawTx } from 'libs/validators';

export function signRawTxWithPrivKey(
  privKey: Buffer,
  rawTx: RawTransaction
): string {
  if (!isValidRawTx(rawTx)) {
    throw new Error('Invalid raw transaction');
  }

  const eTx = new EthTx(rawTx);
  eTx.sign(privKey);
  return '0x' + eTx.serialize().toString('hex');
}

export function signMessageWithPrivKey(
  privKey: Buffer,
  msg: string,
  address: string,
  date: string
): string {
  const spacer = msg.length > 0 && date.length > 0 ? ' ' : '';
  const fullMessage = msg + spacer + date;
  const hash = sha3(fullMessage);
  const signed = ecsign(hash, privKey);
  const combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  const combinedHex = combined.toString('hex');

  return JSON.stringify({
    address,
    msg: fullMessage,
    sig: '0x' + combinedHex
  });
}
