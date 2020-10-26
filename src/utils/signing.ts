import { toChecksumAddress } from 'ethereumjs-util';
import { verifyMessage } from 'ethers/utils';

import { ISignedMessage } from '@types';

export function verifySignedMessage({ address, msg, sig }: ISignedMessage) {
  const signer = verifyMessage(msg, sig);
  return signer === toChecksumAddress(address);
}
