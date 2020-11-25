import { useContext } from 'react';

import { createNetwork, updateNetwork as updateNetworkRedux, useDispatch } from '@store';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { Network, NetworkId, NodeOptions } from '@types';

import { EthersJS } from '../../EthService/network/ethersJsProvider';
import { DataContext } from '../DataManager';
import { getNetworkById as getNetworkByIdFunc } from './helpers';
import { NetworkUtils } from './utils';

export interface INetworkContext {
  networks: Network[];
  addNetwork(item: Network): void;
  updateNetwork(item: Network): void;
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
  const { networks } = useContext(DataContext);
  const dispatch = useDispatch();

  const addNetwork = (network: Network) => dispatch(createNetwork(network));
  const updateNetwork = (item: Network) => dispatch(updateNetworkRedux(item));
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

    updateNetwork(n);
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

    updateNetwork(networkUpdate);
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

    updateNetwork(networkUpdate);
    EthersJS.updateEthersInstance(networkUpdate);
  };
  const setNetworkSelectedNode = (networkId: NetworkId, selectedNode: string) => {
    const foundNetwork = networks.find((n: Network) => n.id === networkId);

    if (!foundNetwork) {
      throw new Error(`No network found with network id: ${networkId}`);
    }

    const network = { ...foundNetwork, selectedNode };

    updateNetwork(network);
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
