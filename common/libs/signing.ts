import EthTx from 'ethereumjs-tx';
import { ecsign, ecrecover, publicToAddress } from 'ethereumjs-util';
import sha3 from 'solidity-sha3';
import { RawTransaction } from 'libs/transaction';
import { isValidRawTx } from 'libs/validators';

export interface SignatureArgs {
  r: Buffer;
  s: Buffer;
  v: number;
}

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
  return JSON.stringify({
    address,
    msg: fullMessage,
    sig: signed
  });
}

export function verifyAddrFromRecoveredSig(
  address: string,
  msg: string,
  signature: SignatureArgs
): boolean {
  console.log(ecrecover(sha3(msg), signature.v, signature.r, signature.s));
  return (
    address ===
    publicToAddress(
      ecrecover(sha3(msg), signature.v, signature.r, signature.s)
    ).toString('utf-8')
  );
}
