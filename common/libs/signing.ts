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
  msg: string;
  sig: string;
  version: string;
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L118
export function verifySignedMessage({ address, msg, sig, version }: ISignedMessage) {
  const sigb = new Buffer(stripHexPrefixAndLower(sig), 'hex');
  if (sigb.length !== 65) {
    return false;
  }
  //TODO: explain what's going on here
  sigb[64] = sigb[64] === 0 || sigb[64] === 1 ? sigb[64] + 27 : sigb[64];
  const hash = version === '2' ? hashPersonalMessage(toBuffer(msg)) : sha3(msg);
  const pubKey = ecrecover(hash, sigb[64], sigb.slice(0, 32), sigb.slice(32, 64));

  return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}
