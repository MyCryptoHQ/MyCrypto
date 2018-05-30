import { TypeKeys as WalletTypeKeys } from 'actions/wallet/constants';
import { Web3Wallet } from 'libs/wallet';
import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery, call, apply, take } from 'redux-saga/effects';
import {
  changeNodeForce,
  TypeKeys,
  web3SetNode,
  web3UnsetNode,
  changeNodeRequested
} from 'actions/config';
import {
  getNodeId,
  getPreviouslySelectedNode,
  getNetworkByChainId,
  getWeb3Node
} from 'selectors/config';
import { setupWeb3Node, Web3Service, isWeb3Node } from 'libs/nodes/web3';
import { SetWalletAction, setWallet } from 'actions/wallet';
import {
  shepherd,
  makeProviderConfig,
  getShepherdManualMode,
  makeWeb3Network,
  stripWeb3Network
} from 'libs/nodes';
import { StaticNodeConfig } from 'shared/types/node';
import { showNotification } from 'actions/notifications';
import translate from 'translations';

let web3Added = false;

export function* initWeb3Node(): SagaIterator {
  const { chainId, lib } = yield call(setupWeb3Node);
  const network: ReturnType<typeof getNetworkByChainId> = yield select(
    getNetworkByChainId,
    chainId
  );

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
    yield apply(shepherd, shepherd.auto);
  }

  if (!web3Added) {
    shepherd.useProvider('web3', id, makeProviderConfig({ network: web3Network }));
  }

  web3Added = true;

  yield put(web3SetNode({ id, config }));
  return lib;
}

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    const nodeLib = yield call(initWeb3Node);
    yield put(changeNodeRequested('web3'));
    yield take(
      (action: any) =>
        action.type === TypeKeys.CONFIG_CHANGE_NODE_SUCCEEDED && action.payload.nodeId === 'web3'
    );

    const web3Node: any | null = yield select(getWeb3Node);
    if (!web3Node) {
      throw Error('Web3 node config not found!');
    }
    const network = web3Node.network;

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = yield apply(nodeLib, nodeLib.getAccounts);
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Mist.');
    }
    const wallet = new Web3Wallet(address, stripWeb3Network(network));
    yield put(setWallet(wallet));
  } catch (err) {
    console.error(err);
    // unset web3 node so node dropdown isn't disabled
    yield put(web3UnsetNode());
    yield put(showNotification('danger', translate(err.message)));
  }
}

// unset web3 as the selected node if a non-web3 wallet has been selected
export function* unsetWeb3NodeOnWalletEvent(action: SetWalletAction): SagaIterator {
  const node = yield select(getNodeId);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  const prevNodeId: string = yield select(getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(prevNodeId));
}

export function* unsetWeb3Node(): SagaIterator {
  const node = yield select(getNodeId);

  if (node !== 'web3') {
    return;
  }

  const prevNodeId: string = yield select(getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(prevNodeId));
}

export const web3 = [
  takeEvery(TypeKeys.CONFIG_NODE_WEB3_UNSET, unsetWeb3Node),
  takeEvery(WalletTypeKeys.WALLET_SET, unsetWeb3NodeOnWalletEvent),
  takeEvery(WalletTypeKeys.WALLET_UNLOCK_WEB3, unlockWeb3)
];
