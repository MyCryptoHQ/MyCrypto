import { NonWeb3NodeConfigs, Web3NodeConfig } from 'reducers/config/nodes/typings';
import { EtherscanNode, InfuraNode, RPCNode } from 'libs/nodes';
import { ConfigAction } from 'actions/config';

export type State = NonWeb3NodeConfigs & Web3NodeConfig;

export const INITIAL_STATE: State = {
  eth_mew: {
    networkName: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  },
  eth_mycrypto: {
    networkName: 'ETH',
    lib: new RPCNode('https://api.mycryptoapi.com/eth'),
    service: 'MyCrypto',
    estimateGas: true
  },
  eth_ethscan: {
    networkName: 'ETH',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://api.etherscan.io/api'),
    estimateGas: false
  },
  eth_infura: {
    networkName: 'ETH',
    service: 'infura.io',
    lib: new InfuraNode('https://mainnet.infura.io/mew'),
    estimateGas: false
  },
  rop_mew: {
    networkName: 'Ropsten',
    service: 'MyEtherWallet',
    lib: new RPCNode('https://api.myetherapi.com/rop'),
    estimateGas: false
  },
  rop_infura: {
    networkName: 'Ropsten',
    service: 'infura.io',
    lib: new InfuraNode('https://ropsten.infura.io/mew'),
    estimateGas: false
  },
  kov_ethscan: {
    networkName: 'Kovan',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://kovan.etherscan.io/api'),
    estimateGas: false
  },
  rin_ethscan: {
    networkName: 'Rinkeby',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://rinkeby.etherscan.io/api'),
    estimateGas: false
  },
  rin_infura: {
    networkName: 'Rinkeby',
    service: 'infura.io',
    lib: new InfuraNode('https://rinkeby.infura.io/mew'),
    estimateGas: false
  },
  etc_epool: {
    networkName: 'ETC',
    service: 'Epool.io',
    lib: new RPCNode('https://mewapi.epool.io'),
    estimateGas: false
  },
  ubq: {
    networkName: 'UBQ',
    service: 'ubiqscan.io',
    lib: new RPCNode('https://pyrus2.ubiqscan.io'),
    estimateGas: true
  },
  exp_tech: {
    networkName: 'EXP',
    service: 'Expanse.tech',
    lib: new RPCNode('https://node.expanse.tech/'),
    estimateGas: true
  }
};

export const defaultNodes = (state: State = INITIAL_STATE, action: ConfigAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
