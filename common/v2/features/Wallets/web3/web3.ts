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
import { getNetworkByChainId, NetworkSelect } from 'v2/libs';
import { translateRaw } from 'translations';
import { createNodeOptions, readNodeOptions, createNodeOptionsWithID } from 'v2/services/NodeOptions/NodeOptions';
import { updateCurrents, readCurrents } from 'v2/services/Currents/Currents';

//#region Web3

let web3Added = true;

export const initWeb3Node = async () => {
  console.log('got init')
  const { chainId, lib } = await setupWeb3Node();
  console.log('got init2')
  const network: NetworkSelect = getNetworkByChainId(chainId);
  console.log('got init3')
  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  console.log('got init4')
  const web3Network = makeWeb3Network(network.id);
  console.log('got here? ' + JSON.stringify(web3Network, null, 4))
  const id = 'web3';
  console.log('got init5')
  const config: NodeOptions = {
    name: id,
    isCustom: false,
    type: 'web3',
    service: Web3Service,
    hidden: true,
    network: web3Network
  };
  console.log('got init6')
  if (getShepherdManualMode()) {
    shepherd.auto();
  }
  console.log('got init7')
  if (!web3Added) {
    console.log('got init 7.5')
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }
  console.log('got init8')
  web3Added = true;
  createNodeOptionsWithID(config,  id)
  console.log('got init9')
  updateCurrents({ node: 'web3' });
  console.log('got init10')
  console.log(lib)
  return lib;
};

export const unlockWeb3 = async () => {
  try {
    console.log('did i get here?')
    const nodeLib = await initWeb3Node();

    console.log('did i get here?1')
    /*await (action: any) => {
      action.type === configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_SUCCEEDED &&
        action.payload.nodeId === 'web3'
    }*/

    const web3Node: any | null = await getWeb3Node();
    console.log('did i get here?1.1')
    if (!web3Node) {
      throw Error('Web3 node config not found!');
    }
    console.log(web3Node)
    const network = web3Node.network;

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = await nodeLib.getAccounts();
    console.log('accounts: ' + accounts)
    const address = accounts[0];
    console.log('did i get here?3')
    if (!address) {
      throw new Error('No accounts found in MetaMask / Web3.');
    }
    console.log('did i get here?4 ' + network)
    console.log(new Web3Wallet(address, stripWeb3Network(network)))
    console.log('did i get here?6')
    return new Web3Wallet(address, stripWeb3Network(network));
  } catch (err) {
    console.error(err);
    // unset web3 node so node dropdown isn't disabled
    //configNodesStaticActions.web3UnsetNode();
    console.log('Error ' + translateRaw(err.message));
  }
};

export const getWeb3Node = async () => {
  
  console.log('getWeb3 1')
  const currNode = readNodeOptions('web3');
  console.log('getWeb3 2')
  const currNodeId = readCurrents().node;
  console.log('getWeb3 4')
  console.log('next - ' + (currNode && currNodeId && isWeb3NodeId(currNodeId)) + ' - ' + currNode + ' - ' + currNodeId)
  if (currNode && currNodeId && isWeb3NodeId(currNodeId)) {
    console.log('getWeb3 5')
    return currNode;
  }
  return null;
};
export const isWeb3NodeId = (nodeId: string) => nodeId === 'web3';
export const getNodes = async () => {};

export const getCurrentNode = async () => {};

export const createNewWeb3Node = async (id: string, newNode: CustomNodeConfig) => {
  createNodeOptions({ ...newNode, name: id, type: 'web3' });
};
