import { normalise } from 'v2/services/EthService';
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
    reverse: true
  };
}

export function isValidENSName(str: string) {
  try {
    return (
      str.length > 6 && !str.includes('.') && normalise(str) !== '' && str.substring(0, 2) !== '0x'
    );
  } catch (e) {
    return false;
  }
}

export function isValidENSAddress(address: string, validTLDs: ITLDCollection): boolean {
  try {
    const normalized = normalise(address);
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
