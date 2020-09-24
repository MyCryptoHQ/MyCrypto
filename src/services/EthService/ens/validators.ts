import { normalize } from '@utils';

export interface ITLDCollection {
  [key: string]: boolean;
}

export function getENSTLDForChain(chainId: number): string {
  if (chainId === 30) {
    return 'rsk';
  }

  return 'eth';
}

export function getValidTLDsForChain(chainId: number): ITLDCollection {
  if (chainId === 30) {
    return { rsk: true };
  }

  return {
    eth: true,
    test: true,
    reverse: true,
    xyz: true
  };
}

export function isValidENSName(str: string) {
  try {
    return str.includes('.') && normalize(str) !== '';
  } catch (e) {
    return false;
  }
}

export function isValidENSAddress(address: string, validTLDs: ITLDCollection): boolean {
  try {
    const normalized = normalize(address);
    const tld = normalized.substr(normalized.lastIndexOf('.') + 1);

    if (validTLDs[tld]) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

export function getIsValidENSAddressFunction(chainId: number) {
  const validTLDs = getValidTLDsForChain(chainId);

  return (address: string) => isValidENSAddress(address, validTLDs);
}
