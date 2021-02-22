import { toChecksumAddress as toChecksumAddressFn } from 'ethereumjs-util';

import { NETWORKS_CONFIG } from '@database/data';

// @todo: Replace with `Network` type once `NetworkLegacy` is removed
export interface Checksummable {
  chainId: number;
  eip1191?: boolean;
}

export function toChecksumAddress(
  address: string,
  network: Checksummable | number = NETWORKS_CONFIG.Ethereum
) {
  const foundNetwork =
    typeof network === 'number'
      ? Object.values(NETWORKS_CONFIG).find((n) => n.chainId === network)
      : network;
  if (!foundNetwork) {
    throw new Error(`Network with chain ID ${network} not found`);
  }

  if (foundNetwork.eip1191) {
    return toChecksumAddressFn(address, foundNetwork.chainId);
  }

  return toChecksumAddressFn(address);
}

export function isChecksumAddress(address: string, network: Checksummable | number): boolean {
  try {
    return address === toChecksumAddress(address, network);
  } catch {
    // toChecksumAddress throws if the provided address is invalid
    return false;
  }
}
