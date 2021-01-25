import { verifyMessage } from '@ethersproject/wallet';
import { toChecksumAddress } from 'ethereumjs-util';

import { ISignedMessage } from '@types';

export function verifySignedMessage({ address, msg, sig }: ISignedMessage) {
  const signer = verifyMessage(msg, sig);
  return signer === toChecksumAddress(address);
}
