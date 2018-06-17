const main: IEnsAddresses = require('./main.json');
const rinkeby: IEnsAddresses = require('./rinkeby.json');
const ropsten: IEnsAddresses = require('./ropsten.json');

interface IEnsAddresses {
  public: {
    resolver: string;
    reverse: string;
    ethAuction: string;
  };

  registry: string;
}

const ensNetworksByKey: { [key: string]: IEnsAddresses } = {
  ETH: main,
  Rinkeby: rinkeby,
  Ropsten: ropsten
};

export default { main, rinkeby, ropsten, ensNetworksByKey };
