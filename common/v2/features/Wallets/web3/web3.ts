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
import {
  createNodeOptions,
  readNodeOptions,
  createNodeOptionsWithID
} from 'v2/services/NodeOptions/NodeOptions';
import { updateCurrents, readCurrents } from 'v2/services/Currents/Currents';
import * as types from './types';
import { createBrowserHistory } from 'history';
//#region Web3

let web3Added = true;

export const initWeb3Node = async () => {
  console.log('got init');
  const { chainId, lib } = await setupWeb3Node();
  console.log('got init2');
  const network: NetworkSelect = getNetworkByChainId(chainId);
  console.log('got init3');
  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  console.log('got init4');
  const web3Network = makeWeb3Network(network.id);
  console.log('got here? ' + JSON.stringify(web3Network, null, 4));
  const id = 'web3';
  console.log('got init5');
  const config: NodeOptions = {
    name: id,
    isCustom: false,
    type: 'web3',
    service: Web3Service,
    hidden: true,
    network: web3Network
  };
  console.log('got init6');
  if (getShepherdManualMode()) {
    shepherd.auto();
  }
  console.log('got init7');
  if (!web3Added) {
    console.log('got init 7.5');
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }
  console.log('got init8');
  web3Added = true;
  createNodeOptionsWithID(config, id);
  console.log('got init9');
  updateCurrents({ node: 'web3' });
  console.log('got init10');
  console.log(lib);
  return lib;
};

export function unlockWeb3(): types.UnlockWeb3Action {
  return {
    type: types.WalletActions.UNLOCK_WEB3
  };
}

export const getWeb3Node = async () => {
  console.log('getWeb3 1');
  const currNode = readNodeOptions('web3');
  console.log('getWeb3 2');
  const currNodeId = readCurrents().node;
  console.log('getWeb3 4');
  console.log(
    'next - ' +
      (currNode && currNodeId && isWeb3NodeId(currNodeId)) +
      ' - ' +
      currNode +
      ' - ' +
      currNodeId
  );
  if (currNode && currNodeId && isWeb3NodeId(currNodeId)) {
    console.log('getWeb3 5');
    return currNode;
  }
  return null;
};
export const isWeb3NodeId = (nodeId: string) => nodeId === 'web3';

export const createNewWeb3Node = async (id: string, newNode: CustomNodeConfig) => {
  createNodeOptions({ ...newNode, name: id, type: 'web3' });
};
