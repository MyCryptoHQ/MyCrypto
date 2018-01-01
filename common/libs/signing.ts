import EthTx from 'ethereumjs-tx';
import {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress
} from 'ethereumjs-util';
import { stripHexPrefixAndLower } from 'libs/values';

export function signRawTxWithPrivKey(privKey: Buffer, t: EthTx): Buffer {
  t.sign(privKey);
  return t.serialize();
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L95
export function signMessageWithPrivKeyV2(privKey: Buffer, msg: string): string {
  const hash = hashPersonalMessage(toBuffer(msg));
  const signed = ecsign(hash, privKey);
  const combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  const combinedHex = combined.toString('hex');

  return addHexPrefix(combinedHex);
}

export interface ISignedMessage {
  address: string;
  message: string;
  signature: string;
  version: string;
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L118
export function verifySignedMessage({ address, message, signature, version }: ISignedMessage) {
  const sig = new Buffer(stripHexPrefixAndLower(signature), 'hex');
  if (sig.length !== 65) {
    return false;
  }
  //TODO: explain what's going on here
  sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
  const hash = version === '2' ? hashPersonalMessage(toBuffer(message)) : sha3(message);
  const pubKey = ecrecover(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64));

  return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}
