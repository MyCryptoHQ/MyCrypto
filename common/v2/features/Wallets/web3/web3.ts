import { isWeb3Node, setupWeb3Node, Web3Service } from 'libs/nodes/web3';
import { Web3Wallet } from 'libs/wallet';
import {
  stripWeb3Network,
  makeWeb3Network,
  getShepherdManualMode,
  shepherd,
  makeProviderConfig
} from 'libs/nodes';
import { configNodesSelectedActions, configNodesStaticActions } from 'features/config';
import { StaticNodeConfig, CustomNodeConfig } from 'v2/services/NodeOptions/types';
import { getNetworkByChainId, NetworkSelect } from 'v2/libs';
import { translateRaw } from 'translations';
import { LocalCache } from 'v2/services/LocalCache/constants';
import { createNodeOptions }  from 'v2/services/NodeOptions/NodeOptions';


//#region Web3

let web3Added = false;

export const initWeb3Node = async () => {
  const { chainId, lib } = await setupWeb3Node();
  const network: NetworkSelect = getNetworkByChainId(chainId);

  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }

  const web3Network = makeWeb3Network(network.id);
  const id = 'web3';

  const config: StaticNodeConfig = {
    id,
    isCustom: false,
    network: web3Network as any,
    service: Web3Service,
    hidden: true
  };

  if (getShepherdManualMode()) {
    shepherd.auto();
  }

  if (!web3Added) {
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }

  web3Added = true;

  setNode(id, config);
  return lib;
};

export const unlockWeb3 = async () => {
  try {
    const nodeLib = await initWeb3Node();

    configNodesSelectedActions.changeNodeRequested('web3');
    /*await (action: any) => {
      action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeId === 'web3'
    }*/

    const web3Node: any | null = getWeb3Node();

    if (!web3Node) {
      throw Error('Web3 node config not found!');
    }

    const network = web3Node.network;

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = await nodeLib.getAccounts();
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Web3.');
    }
    return new Web3Wallet(address, stripWeb3Network(network));
  } catch (err) {
    console.error(err);
    // unset web3 node so node dropdown isn't disabled
    configNodesStaticActions.web3UnsetNode();
    console.log('Error ' + translateRaw(err.message));
  }
};

export const getWeb3Node = async () => {
  const isWeb3Node = (nodeId: string) => nodeId === 'web3';
  const currNode = configNodesStaticSelectors.getStaticNodeConfig(state);
  const currNodeId = configNodesSelectedSelectors.getNodeId(state);
  if (currNode && currNodeId && isWeb3Node(currNodeId)) {
    return currNode;
  }
  return null;
};

export const getNodes = async () => {};

export const getCurrentNode = async () => {};

export const createNewWeb3Node = async (id: string, newNode: CustomNodeConfig) => {
  createNodeOptions({ ...newNode, name: id, type: 'web3' });
};
