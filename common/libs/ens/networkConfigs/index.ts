const main: IEnsAddresses = require('./main.json');
const rinkeby: IEnsAddresses = require('./rinkeby.json');
const ropsten: IEnsAddresses = require('./ropsten.json');
const rsk: IEnsAddresses = require('./rsk.json');

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
