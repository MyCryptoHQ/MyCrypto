import main from './main.json';
import rinkeby from './rinkeby.json';
import ropsten from './ropsten.json';
import rsk from './rsk.json';

interface IEnsAddresses {
  public: {
    resolver: string;
    reverse: string;
    ethAuction: string;
  };
  registry: string;
}

export interface ITLDCollection {
  [key: string]: boolean;
}

export function getENSAddressesForChain(chainId: number): IEnsAddresses {
  switch (chainId) {
    case 30:
      return rsk;
    default:
      return main;
  }
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

export default { main, rinkeby, ropsten, rsk };
