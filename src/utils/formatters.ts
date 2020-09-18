import { toChecksumAddress as toETHChecksumAddress } from 'ethereumjs-util';
import { toChecksumAddress as toRSKChecksumAddress } from 'rskjs-util';

// Regex modified from this stackoverflow answer
// https://stackoverflow.com/a/10805198, with the comma character added as a
// delimiter (in the case of csv style mnemonic phrases) as well as any stray
// space characters. it should be fairly easy to add new delimiters as required
export function formatMnemonic(phrase: string) {
  return phrase.replace(/(\r\n|\n|\r|\s+|,)/gm, ' ').trim();
}

// Checksumming split into two functions so it's shared by network selector
function getChecksumAddressFunction(chainId: number) {
  if (chainId === 30 || chainId === 31) {
    return (addr: string) => toRSKChecksumAddress(addr, chainId);
  }
  return toETHChecksumAddress;
}

export function toChecksumAddressByChainId(address: string, chainId: number) {
  return getChecksumAddressFunction(chainId)(address);
}
