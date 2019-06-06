import { isWeb3Node, setupWeb3Node, Web3Service } from 'v2/libs/nodes/web3';
import { Web3Wallet } from 'v2/libs/wallet';
import {
  stripWeb3Network,
  makeWeb3Network,
  getShepherdManualMode,
  shepherd,
  makeProviderConfig
} from 'libs/nodes';
import { CustomNodeConfig, NodeOptions } from 'v2/services/NodeOptions/types';
import { getNetworkByChainId } from 'v2/libs';
import { translateRaw } from 'translations';
import {
  createNodeOptions,
  readNodeOptions,
  createNodeOptionsWithID
} from 'v2/services/NodeOptions/NodeOptions';
import { updateSetting, readAllSettings } from 'v2/services/Settings/Settings';
import { Network } from 'v2/services/Network/types';

//#region Web3

let web3Added = true;

export const initWeb3Node = async () => {
  const { chainId, lib } = await setupWeb3Node();
  const network: Network | undefined = getNetworkByChainId(chainId);
  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  const web3Network = makeWeb3Network(network.id);
  const id = 'web3';
  const config: NodeOptions = {
    name: id,
    isCustom: false,
    type: 'web3',
    url: 'undefined',
    service: Web3Service,
    hidden: true,
    network: web3Network
  };
  if (getShepherdManualMode()) {
    shepherd.auto();
  }
  if (!web3Added) {
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }
  web3Added = true;
  createNodeOptionsWithID(config, id);
  updateSetting({ ...readAllSettings(), node: 'web3' });
  return lib;
};

export const unlockWeb3 = async () => {
  try {
    const nodeLib = await initWeb3Node();

    /*await (action: any) => {
      action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeId === 'web3'
    }*/

    const web3Node: any | null = await getWeb3Node();
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
    // unset web3 node so node dropdown isn't disabled
    //configNodesStaticActions.web3UnsetNode();
    console.log('Error ' + translateRaw(err.message));
  }
};

export const getWeb3Node = async () => {
  const currNode = readNodeOptions('web3');
  const currNodeId = readAllSettings().node;
  if (currNode && currNodeId && isWeb3NodeId(currNodeId)) {
    return currNode;
  }
  return null;
};
export const isWeb3NodeId = (nodeId: string) => nodeId === 'web3';

export const createNewWeb3Node = async (id: string, newNode: CustomNodeConfig) => {
  createNodeOptions({ ...newNode, name: id, type: 'web3' });
};
