import { verifyMessage } from '@ethersproject/wallet';

import { ISignedMessage } from '@types';

import { toChecksumAddress } from './checksum';

export function verifySignedMessage({ address, msg, sig }: ISignedMessage) {
  const signer = verifyMessage(msg, sig);
  return signer === toChecksumAddress(address);
}
