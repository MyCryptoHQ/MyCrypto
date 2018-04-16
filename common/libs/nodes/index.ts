import { shepherd, redux } from 'mycrypto-shepherd';
import { INode } from '.';
import { tokenBalanceHandler } from './tokenBalanceProxy';
import { IProviderConfig } from 'mycrypto-shepherd/dist/lib/ducks/providerConfigs';

type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;
const { selectors, store } = redux;
const { providerBalancerSelectors: { balancerConfigSelectors } } = selectors;

export const makeProviderConfig = (options: DeepPartial<IProviderConfig> = {}): IProviderConfig => {
  const defaultConfig: IProviderConfig = {
    concurrency: 2,
    network: 'ETH',
    requestFailureThreshold: 3,
    supportedMethods: {
      getNetVersion: true,
      ping: true,
      sendCallRequest: true,
      sendCallRequests: true,
      getBalance: true,
      estimateGas: true,
      getTransactionCount: true,
      getCurrentBlock: true,
      sendRawTx: true,

      getTransactionByHash: true,
      getTransactionReceipt: true,

      /*web3 methods*/
      signMessage: true,
      sendTransaction: true
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
shepherd
  .init()
  .then(
    provider => (shepherdProvider = (new Proxy(provider, tokenBalanceHandler) as any) as INode)
  );

export const getShepherdManualMode = () => balancerConfigSelectors.getManualMode(store.getState());

export const getShepherdOffline = () => balancerConfigSelectors.isOffline(store.getState());

export const getShepherdNetwork = () => balancerConfigSelectors.getNetwork(store.getState());

export const getShepherdPending = () =>
  balancerConfigSelectors.isSwitchingNetworks(store.getState());

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
shepherd.useProvider('rpc', 'etc_commonwealth', regEtcConf, 'https://etc-geth.0xinfra.com/');

const regUbqConf = makeProviderConfig({ network: 'UBQ' });
shepherd.useProvider('rpc', 'ubq', regUbqConf, 'https://pyrus2.ubiqscan.io');

const regExpConf = makeProviderConfig({ network: 'EXP' });
shepherd.useProvider('rpc', 'exp_tech', regExpConf, 'https://node.expanse.tech/');

const regPoaConf = makeProviderConfig({ network: 'POA' });
shepherd.useProvider('rpc', 'poa', regPoaConf, 'https://core.poa.network');

const regTomoConf = makeProviderConfig({ network: 'TOMO' });
shepherd.useProvider('rpc', 'tomo', regTomoConf, 'https://core.tomocoin.io');

const regEllaConf = makeProviderConfig({ network: 'ELLA' });
shepherd.useProvider('rpc', 'ella', regEllaConf, 'https://jsonrpc.ellaism.org');

/**
 * Pseudo-networks to support metamask / web3 interaction
 */
const web3EthConf = makeProviderConfig({
  network: makeWeb3Network('ETH'),
  supportedMethods: {
    sendRawTx: false,
    sendTransaction: false,
    signMessage: false,
    getNetVersion: false
  }
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
  supportedMethods: {
    sendRawTx: false,
    sendTransaction: false,
    signMessage: false,
    getNetVersion: false
  }
});
shepherd.useProvider(
  'infura',
  'web3_rop_infura',
  web3RopConf,
  'https://ropsten.infura.io/mycrypto'
);

const web3KovConf = makeProviderConfig({
  network: makeWeb3Network('Kovan'),
  supportedMethods: {
    sendRawTx: false,
    sendTransaction: false,
    signMessage: false,
    getNetVersion: false
  }
});
shepherd.useProvider(
  'etherscan',
  'web3_kov_ethscan',
  web3KovConf,
  'https://kovan.etherscan.io/api'
);

const web3RinConf = makeProviderConfig({
  network: makeWeb3Network('Rinkeby'),
  supportedMethods: {
    sendRawTx: false,
    sendTransaction: false,
    signMessage: false,
    getNetVersion: false
  }
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
