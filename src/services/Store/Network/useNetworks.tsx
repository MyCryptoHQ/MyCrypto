import { useContext } from 'react';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

import { Network, NetworkId, NodeOptions, LSKeys } from '@types';

import { DataContext } from '../DataManager';
import { NetworkUtils } from './utils';
import { EthersJS } from '../../EthService/network/ethersJsProvider';
import { getNetworkById as getNetworkByIdFunc } from './helpers';

export interface INetworkContext {
  networks: Network[];
  addNetwork(item: Network): void;
  updateNetwork(id: NetworkId, item: Network): void;
  getNetworkById(networkId: NetworkId): Network;
  getNetworkByChainId(chainId: number): Network | undefined;
  getNetworkNodes(networkId: NetworkId): NodeOptions[];
  addNodeToNetwork(node: NodeOptions, network: Network | NetworkId): void;
  updateNode(node: NodeOptions, network: Network | NetworkId, nodeName: string): void;
  deleteNode(nodeName: string, network: Network | NetworkId): void;
  setNetworkSelectedNode(networkId: NetworkId, selectedNode: string): void;
  isNodeNameAvailable(networkId: NetworkId, nodeName: string, ignoreNames?: string[]): boolean;
}

function useNetworks() {
  const { createActions, networks } = useContext(DataContext);
  const model = createActions(LSKeys.NETWORKS);

  const addNetwork = (network: Network) => model.create(network);
  const updateNetwork = (id: NetworkId, item: Network) => model.update(id, item);
  const getNetworkById = (networkId: NetworkId) => {
    const foundNetwork = getNetworkByIdFunc(networkId, networks);
    if (foundNetwork) {
      return foundNetwork;
    }
    throw new Error(`No network found with network id: ${networkId}`);
  };
  const getNetworkByChainId = (chainId: number) => {
    return networks.find((network: Network) => network.chainId === chainId);
  };

  const getNetworkNodes = (networkId: NetworkId) => {
    const foundNetwork = getNetworkById(networkId);
    if (foundNetwork) {
      return foundNetwork.nodes;
    }
    return [];
  };
  const addNodeToNetwork = (node: NodeOptions, network: Network | NetworkId) => {
    let networkToAdd: Network = network as Network;
    if (isString(network)) {
      networkToAdd = getNetworkById(network);
    }

    const n = {
      ...networkToAdd,
      nodes: [...networkToAdd.nodes, node],
      selectedNode: node.name
    };

    updateNetwork(networkToAdd.id, n);
    EthersJS.updateEthersInstance(n);
  };

  const updateNode = (node: NodeOptions, network: Network | NetworkId, nodeName: string) => {
    let networkToEdit: Network = network as Network;
    if (isString(network)) {
      networkToEdit = getNetworkById(network);
    }

    const { nodes } = networkToEdit;

    const networkUpdate = {
      ...networkToEdit,
      nodes: [...nodes.filter((n) => n.name !== nodeName), node],
      selectedNode: node.name
    };

    updateNetwork(networkToEdit.id, networkUpdate);
    EthersJS.updateEthersInstance(networkUpdate);
  };
  const deleteNode = (nodeName: string, network: Network | NetworkId) => {
    let networkToEdit: Network = network as Network;
    if (isString(network)) {
      networkToEdit = getNetworkById(network);
    }

    const { nodes } = networkToEdit;

    const newNodes = [...nodes.filter((n) => n.name !== nodeName)];

    const newSelectedNode = (() => {
      if (
        networkToEdit.selectedNode === nodeName &&
        (networkToEdit.selectedNode === networkToEdit.autoNode ||
          networkToEdit.autoNode === undefined)
      ) {
        return newNodes[0]?.name;
      } else if (networkToEdit.selectedNode === nodeName) {
        return networkToEdit.autoNode;
      }
      return networkToEdit.selectedNode;
    })();

    const networkUpdate = {
      ...networkToEdit,
      nodes: newNodes,
      selectedNode: newSelectedNode
    };

    updateNetwork(networkToEdit.id, networkUpdate);
    EthersJS.updateEthersInstance(networkUpdate);
  };
  const setNetworkSelectedNode = (networkId: NetworkId, selectedNode: string) => {
    const foundNetwork = networks.find((n: Network) => n.id === networkId);

    if (!foundNetwork) {
      throw new Error(`No network found with network id: ${networkId}`);
    }

    const network = { ...foundNetwork, selectedNode };

    updateNetwork(networkId, network);
    EthersJS.updateEthersInstance(network);
  };
  const isNodeNameAvailable = (
    networkId: NetworkId,
    nodeName: string,
    ignoreNames: string[] = []
  ) => {
    if (isEmpty(networkId) || isEmpty(nodeName)) return false;

    const foundNetwork = getNetworkById(networkId);
    if (!foundNetwork) {
      throw new Error(`No network found with network id: ${networkId}`);
    }

    return !foundNetwork.nodes
      .filter((n) => !ignoreNames.includes(n.name))
      .some(
        (n) => n.name.toLowerCase() === NetworkUtils.makeNodeName(networkId, nodeName).toLowerCase()
      );
  };

  return {
    networks,
    addNetwork,
    updateNetwork,
    getNetworkById,
    getNetworkByChainId,
    getNetworkNodes,
    addNodeToNetwork,
    updateNode,
    deleteNode,
    setNetworkSelectedNode,
    isNodeNameAvailable
  };
}

export default useNetworks;
