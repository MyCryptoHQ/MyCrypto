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
import { updateCurrents, readCurrents } from 'v2/services/Currents/Currents';
import * as types from './types';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';

//#region Web3

let web3Added = true;

export const initWeb3Node = async () => {
  const { chainId, lib } = await setupWeb3Node();
  const network: NetworkOptions | undefined = getNetworkByChainId(chainId);
  if (!network) {
    throw new Error(`MyCrypto doesn’t support the network with chain ID '${chainId}'`);
  }
  const web3Network = makeWeb3Network(network.id);
  const id = 'web3';
  const config: NodeOptions = {
    name: id,
    isCustom: false,
    type: 'web3',
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
  updateCurrents({ node: 'web3' });
  return lib;
};

export function unlockWeb3(): types.UnlockWeb3Action {
  return {
    type: types.WalletActions.UNLOCK_WEB3
  };
}

export const getWeb3Node = async () => {
  const currNode = readNodeOptions('web3');
  const currNodeId = readCurrents().node;
  if (currNode && currNodeId && isWeb3NodeId(currNodeId)) {
    return currNode;
  }
  return null;
};
export const isWeb3NodeId = (nodeId: string) => nodeId === 'web3';

export const createNewWeb3Node = async (id: string, newNode: CustomNodeConfig) => {
  createNodeOptions({ ...newNode, name: id, type: 'web3' });
};
