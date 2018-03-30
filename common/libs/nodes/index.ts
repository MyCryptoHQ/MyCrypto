import { shepherd, redux } from 'myc-shepherd';
import { INode } from '.';

export interface IProviderConfig {
  concurrency: number;
  requestFailureThreshold: number;
  timeoutThresholdMs: number;
  supportedMethods: { [rpcMethod in keyof INode]: boolean };
  network: string;
}

type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;

export const makeProviderConfig = (options: DeepPartial<IProviderConfig> = {}): IProviderConfig => {
  const defaultConfig: IProviderConfig = {
    concurrency: 2,
    network: 'ETH',
    requestFailureThreshold: 3,
    supportedMethods: {
      ping: true,
      sendCallRequest: true,
      getBalance: true,
      estimateGas: true,
      getTransactionCount: true,
      getCurrentBlock: true,
      sendRawTx: true,
      getTokenBalance: true,
      getTokenBalances: true,
      getTransactionByHash: true,
      getTransactionReceipt: true
    },
    timeoutThresholdMs: 5000
  };

  return {
    ...defaultConfig,
    ...options,
    supportedMethods: {
      ...defaultConfig.supportedMethods,
      ...(options.supportedMethods ? options.supportedMethods : {})
    }
  };
};
let shepherdProvider: INode;
shepherd.enableLogging();
shepherd.init().then(provider => (shepherdProvider = provider));

export const getShepherdManualMode = () =>
  redux.store.getState().providerBalancer.balancerConfig.manual;
export const getShepherdOffline = () =>
  redux.store.getState().providerBalancer.balancerConfig.offline;

export const makeWeb3Network = (network: string) => `WEB3_${network}`;
export const stripWeb3Network = (network: string) => network.replace('WEB3_', '');
export const isAutoNode = (nodeName: string) => nodeName.endsWith('_auto') || nodeName === 'web3';

const regEthConf = makeProviderConfig({ network: 'ETH' });
shepherd.useProvider('rpc', 'eth_mycrypto', regEthConf, 'https://api.mycryptoapi.com/eth');
shepherd.useProvider('etherscan', 'eth_ethscan', regEthConf, 'https://api.etherscan.io/api');
shepherd.useProvider('infura', 'eth_infura', regEthConf, 'https://mainnet.infura.io/mycrypto');
shepherd.useProvider(
  'rpc',
  'eth_blockscale',
  regEthConf,
  'https://api.dev.blockscale.net/dev/parity'
);

const regRopConf = makeProviderConfig({ network: 'Ropsten' });
shepherd.useProvider('infura', 'rop_infura', regRopConf, 'https://ropsten.infura.io/mycrypto');

const regKovConf = makeProviderConfig({ network: 'Kovan' });
shepherd.useProvider('etherscan', 'kov_ethscan', regKovConf, 'https://kovan.etherscan.io/api');

const regRinConf = makeProviderConfig({ network: 'Rinkeby' });
shepherd.useProvider('infura', 'rin_ethscan', regRinConf, 'https://rinkeby.infura.io/mycrypto');
shepherd.useProvider('etherscan', 'rin_infura', regRinConf, 'https://rinkeby.etherscan.io/api');

const regEtcConf = makeProviderConfig({ network: 'ETC' });
shepherd.useProvider('rpc', 'etc_epool', regEtcConf, 'https://mewapi.epool.io');

const regUbqConf = makeProviderConfig({ network: 'UBQ' });
shepherd.useProvider('rpc', 'ubq', regUbqConf, 'https://pyrus2.ubiqscan.io');

const regExpConf = makeProviderConfig({ network: 'EXP' });
shepherd.useProvider('rpc', 'exp_tech', regExpConf, 'https://node.expanse.tech/');

/**
 * Pseudo-networks to support metamask / web3 interaction
 */
const web3EthConf = makeProviderConfig({
  network: makeWeb3Network('ETH'),
  supportedMethods: { sendRawTx: false }
});
shepherd.useProvider('rpc', 'web3_eth_mycrypto', web3EthConf, 'https://api.mycryptoapi.com/eth');
shepherd.useProvider('etherscan', 'web3_eth_ethscan', web3EthConf, 'https://api.etherscan.io/api');
shepherd.useProvider(
  'infura',
  'web3_eth_infura',
  web3EthConf,
  'https://mainnet.infura.io/mycrypto'
);
shepherd.useProvider(
  'rpc',
  'web3_eth_blockscale',
  web3EthConf,
  'https://api.dev.blockscale.net/dev/parity'
);

const web3RopConf = makeProviderConfig({
  network: makeWeb3Network('Ropsten'),
  supportedMethods: { sendRawTx: false }
});
shepherd.useProvider(
  'infura',
  'web3_rop_infura',
  web3RopConf,
  'https://ropsten.infura.io/mycrypto'
);

const web3KovConf = makeProviderConfig({
  network: makeWeb3Network('Kovan'),
  supportedMethods: { sendRawTx: false }
});
shepherd.useProvider(
  'etherscan',
  'web3_kov_ethscan',
  web3KovConf,
  'https://kovan.etherscan.io/api'
);

const web3RinConf = makeProviderConfig({
  network: makeWeb3Network('Rinkeby'),
  supportedMethods: { sendRawTx: false }
});
shepherd.useProvider(
  'infura',
  'web3_rin_ethscan',
  web3RinConf,
  'https://rinkeby.infura.io/mycrypto'
);
shepherd.useProvider(
  'etherscan',
  'web3_rin_infura',
  web3RinConf,
  'https://rinkeby.etherscan.io/api'
);

export { shepherdProvider, shepherd };
export * from './INode';
