import { toChecksumAddress } from 'ethereumjs-util';
import { toChecksumAddress as toChecksumAddressRSK } from 'rskjs-util';

export function toChecksumAddressByChainId(address: string, chainId: number) {
  if (chainId == 30 || chainId == 31) {
    //Passing chainId = null solves it using ethereumjs-util, to be considered...
    return toChecksumAddressRSK(address, chainId);
  }
  return toChecksumAddress(address);
}
