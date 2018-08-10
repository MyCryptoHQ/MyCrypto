import { shepherd, redux } from 'mycrypto-shepherd';
import { IProviderConfig } from 'mycrypto-shepherd/dist/lib/ducks/providerConfigs';

import { NodeConfig } from 'types/node';
import { tokenBalanceHandler } from './tokenBalanceProxy';
import { NODE_CONFIGS, makeNodeName } from './configs';
import { INode } from '.';

type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;
const { selectors, store } = redux;
const { providerBalancerSelectors: { balancerConfigSelectors } } = selectors;

export const makeProviderConfig = (options: DeepPartial<IProviderConfig> = {}): IProviderConfig => {
  const defaultConfig: IProviderConfig = {
    concurrency: 2,
    network: 'ETH',
    requestFailureThreshold: 10,
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
    timeoutThresholdMs: 10000
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
  .init({ queueTimeout: 10000 })
  .then(
    provider => (shepherdProvider = (new Proxy(provider, tokenBalanceHandler) as any) as INode)
  );

export const getShepherdManualMode = () => balancerConfigSelectors.getManualMode(store.getState());

export const getShepherdOffline = () => balancerConfigSelectors.isOffline(store.getState());

export const getShepherdNetwork = () => balancerConfigSelectors.getNetwork(store.getState());

export const getShepherdPending = () =>
  balancerConfigSelectors.isSwitchingNetworks(store.getState());

const autoNodeSuffix = 'auto';
const web3NodePrefix = 'WEB3_';
export const makeWeb3Network = (network: string) => `${web3NodePrefix}${network}`;
export const stripWeb3Network = (network: string) => network.replace(web3NodePrefix, '');
export const isAutoNode = (nodeName: string) =>
  nodeName.endsWith(autoNodeSuffix) || nodeName === 'web3';
export const isAutoNodeConfig = (node: NodeConfig) => !node.isCustom && node.isAuto;
export const makeAutoNodeName = (network: string) => makeNodeName(network, autoNodeSuffix);

/**
 * Assemble shepherd providers from node configs. Includes pseudo-configs
 */
const WEB3_NETWORKS = ['ETH', 'Ropsten', 'Kovan', 'Rinkeby', 'ETC'];
Object.entries(NODE_CONFIGS).forEach(([network, nodes]) => {
  const nodeProviderConf = makeProviderConfig({ network });
  const web3ProviderConf = WEB3_NETWORKS.includes(network)
    ? makeProviderConfig({
        network: makeWeb3Network(network),
        supportedMethods: {
          sendRawTx: false,
          sendTransaction: false,
          signMessage: false,
          getNetVersion: false
        }
      })
    : null;

  nodes.forEach(n => {
    shepherd.useProvider(n.type, n.name, nodeProviderConf, n.url);
    if (web3ProviderConf) {
      shepherd.useProvider(n.type, `web3_${n.name}`, web3ProviderConf, n.url);
    }
  });
});

export { shepherdProvider, shepherd };
export * from './INode';
export * from './configs';
