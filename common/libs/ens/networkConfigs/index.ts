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

export default { main, rinkeby, ropsten };
