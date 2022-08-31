import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import {
  createNetwork,
  destroyNetwork as deleteNetworkRedux,
  deleteNodeOrNetwork as deleteNodeOrNetworkRedux,
  deleteNode as deleteNodeRedux,
  selectNetworks,
  updateNetwork as updateNetworkRedux,
  useDispatch,
  useSelector
} from '@store';
import { Network, NetworkId, NodeOptions } from '@types';

import { EthersJS } from '../../EthService/network/ethersJsProvider';
import { getNetworkById as getNetworkByIdFunc } from './helpers';
import { NetworkUtils } from './utils';

export interface INetworkContext {
  networks: Network[];
  addNetwork(item: Network): void;
  updateNetwork(item: Network): void;
  deleteNetwork(networkId: NetworkId): void;
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
  const networks = useSelector(selectNetworks);
  const dispatch = useDispatch();

  const addNetwork = (network: Network) => dispatch(createNetwork(network));
  const updateNetwork = (item: Network) => dispatch(updateNetworkRedux(item));
  const deleteNodeOrNetwork = (network: NetworkId, nodeName: string) =>
    dispatch(deleteNodeOrNetworkRedux({ network, nodeName }));
  const deleteNetwork = (id: NetworkId) => dispatch(deleteNetworkRedux(id));
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
  const deleteNode = (nodeName: string, network: NetworkId) =>
    dispatch(deleteNodeRedux({ network, nodeName }));
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
    deleteNetwork,
    deleteNodeOrNetwork,
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
