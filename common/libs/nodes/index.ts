import { IShepherd } from 'mycrypto-shepherd/dist/lib/types/api';
import { IProviderConfig } from 'mycrypto-shepherd/dist/lib/ducks/providerConfigs';

import { NodeConfig } from 'types/node';
import { makeNodeName } from './configs';
import { INode } from '.';

type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;

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

// All of the code in this file is non-working legacy, removed for typechecking reasons
/* tslint:disable */
let shepherd: IShepherd;
let shepherdProvider: INode;
/* tslint:enable */

export const getShepherdManualMode = () => undefined;

export const getShepherdOffline = () => undefined;

export const getShepherdNetwork = () => undefined;

export const getShepherdPending = () => undefined;

const autoNodeSuffix = 'auto';
const web3NodePrefix = 'WEB3_';
export const makeWeb3Network = (network: string) => `${web3NodePrefix}${network}`;
export const stripWeb3Network = (network: string) => network.replace(web3NodePrefix, '');
export const isAutoNode = (nodeName: string) =>
  nodeName.endsWith(autoNodeSuffix) || nodeName === 'web3';
export const isAutoNodeConfig = (node: NodeConfig) => !node.isCustom && node.isAuto;
export const makeAutoNodeName = (network: string) => makeNodeName(network, autoNodeSuffix);

export { shepherdProvider, shepherd };
export * from './INode';
export * from './configs';
