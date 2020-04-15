import React, { useContext, createContext } from 'react';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

import { Network, NetworkId, NodeOptions, LSKeys } from 'v2/types';
import { DataContext } from '../DataManager';
import { NetworkUtils } from './utils';
import { EthersJS } from '../../EthService/network/ethersJsProvider';

export interface INetworkContext {
  networks: Network[];
  updateNetwork(id: NetworkId, item: Network): void;
  getNetworkById(networkId: NetworkId): Network;
  getNetworkByName(name: string): Network | undefined;
  getNetworkByChainId(chainId: number): Network | undefined;
  getNetworkNodes(networkId: NetworkId): NodeOptions[];
  addNodeToNetwork(node: NodeOptions, network: Network | NetworkId): void;
  updateNode(node: NodeOptions, network: Network | NetworkId, nodeName: string): void;
  deleteNode(nodeName: string, network: Network | NetworkId): void;
  setNetworkSelectedNode(networkId: NetworkId, selectedNode: string): void;
  isNodeNameAvailable(networkId: NetworkId, nodeName: string, ignoreNames?: string[]): boolean;
}

export const NetworkContext = createContext({} as INetworkContext);

export const NetworkProvider: React.FC = ({ children }) => {
  const { createActions, networks } = useContext(DataContext);
  const model = createActions(LSKeys.NETWORKS);

  const state: INetworkContext = {
    networks,
    updateNetwork: model.update,
    getNetworkById(networkId: NetworkId): Network {
      const foundNetwork = networks.find((network: Network) => network.id === networkId);
      if (foundNetwork) {
        return foundNetwork;
      }
      throw new Error(`No network found with network id: ${networkId}`);
    },
    getNetworkByName: name => {
      return networks.find((network: Network) => network.name === name);
    },
    getNetworkByChainId: chainId => {
      return networks.find((network: Network) => network.chainId === chainId);
    },
    getNetworkNodes: (networkId: NetworkId) => {
      const foundNetwork = networks.find((network: Network) => network.id === networkId);
      if (foundNetwork) {
        return foundNetwork.nodes;
      }
      return [];
    },
    addNodeToNetwork: (node: NodeOptions, network: Network | NetworkId) => {
      let networkToAdd: Network = network as Network;
      if (isString(network)) {
        networkToAdd = state.getNetworkById(network);
      }

      const n = {
        ...networkToAdd,
        nodes: [...networkToAdd.nodes, node],
        selectedNode: node.name
      };

      state.updateNetwork(networkToAdd.id, n);
      EthersJS.updateEthersInstance(n);
    },
    updateNode: (node: NodeOptions, network: Network | NetworkId, nodeName: string) => {
      let networkToEdit: Network = network as Network;
      if (isString(network)) {
        networkToEdit = state.getNetworkById(network);
      }

      const { nodes } = networkToEdit;

      const networkUpdate = {
        ...networkToEdit,
        nodes: [...nodes.filter(n => n.name !== nodeName), node],
        selectedNode: node.name
      };

      state.updateNetwork(networkToEdit.id, networkUpdate);
      EthersJS.updateEthersInstance(networkUpdate);
    },
    deleteNode: (nodeName: string, network: Network | NetworkId) => {
      let networkToEdit: Network = network as Network;
      if (isString(network)) {
        networkToEdit = state.getNetworkById(network);
      }

      const { nodes } = networkToEdit;

      const networkUpdate = {
        ...networkToEdit,
        nodes: [...nodes.filter(n => n.name !== nodeName)],
        selectedNode:
          networkToEdit.selectedNode === nodeName
            ? networkToEdit.autoNode
            : networkToEdit.selectedNode
      };

      state.updateNetwork(networkToEdit.id, networkUpdate);
      EthersJS.updateEthersInstance(networkUpdate);
    },
    setNetworkSelectedNode: (networkId: NetworkId, selectedNode: string) => {
      const foundNetwork = networks.find((n: Network) => n.id === networkId);

      if (!foundNetwork) {
        throw new Error(`No network found with network id: ${networkId}`);
      }

      const network = { ...foundNetwork, selectedNode };

      state.updateNetwork(networkId, network);
      EthersJS.updateEthersInstance(network);
    },
    isNodeNameAvailable: (networkId: NetworkId, nodeName: string, ignoreNames: string[] = []) => {
      if (isEmpty(networkId) || isEmpty(nodeName)) return false;

      const foundNetwork = networks.find((network: Network) => network.id === networkId);

      if (!foundNetwork) {
        throw new Error(`No network found with network id: ${networkId}`);
      }

      return !foundNetwork.nodes
        .filter(n => !ignoreNames.includes(n.name))
        .some(
          n => n.name.toLowerCase() === NetworkUtils.makeNodeName(networkId, nodeName).toLowerCase()
        );
    }
  };

  return <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>;
};
