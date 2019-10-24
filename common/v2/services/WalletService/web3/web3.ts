import { translateRaw } from 'v2/translations';

import { isWeb3Node, setupWeb3Node, Web3Service } from 'v2/services/EthService';
import { NodeOptions, NodeType, Network } from 'v2/types';
import {
  getNetworkByChainId,
  createNode,
  getNodeByName,
  updateSetting,
  readAllSettings
} from 'v2/services/Store';
import { Web3Wallet } from '../non-deterministic';

const web3NodePrefix = 'WEB3_';
export const makeWeb3Network = (network: string) => `${web3NodePrefix}${network}`;

export const initWeb3Node = async () => {
  const { chainId, lib } = await setupWeb3Node();
  const network: Network | undefined = getNetworkByChainId(parseInt(chainId, 10));
  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  const web3Network = makeWeb3Network(network.id);
  const id = 'web3';
  const config: NodeOptions = {
    name: id,
    isCustom: false,
    type: NodeType.WEB3,
    url: '',
    service: Web3Service,
    hidden: true,
    network: web3Network
  };
  createNode(config, network);
  updateSetting({ ...readAllSettings(), node: 'web3' });
  return { nodeLib: lib, network };
};

export const unlockWeb3 = async () => {
  try {
    const { nodeLib, network } = await initWeb3Node();

    /*await (action: any) => {
      action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeId === 'web3'
    }*/

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = await nodeLib.getAccounts();
    const address = accounts[0];
    if (!address) {
      throw new Error('No accounts found in MetaMask / Web3.');
    }
    return new Web3Wallet(address, network.id);
  } catch (err) {
    // unset web3 node so node dropdown isn't disabled
    //configNodesStaticActions.web3UnsetNode();
    console.error('Error ' + translateRaw(err.message));
  }
};

export const getWeb3Node = async () => {
  const currNode = getNodeByName('web3');
  const currNodeId = readAllSettings().node;
  if (currNode && currNodeId && isWeb3NodeId(currNodeId)) {
    return currNode;
  }
  return null;
};
export const isWeb3NodeId = (nodeId: string) => nodeId === 'web3';
