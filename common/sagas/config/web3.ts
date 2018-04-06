import { TypeKeys as WalletTypeKeys } from 'actions/wallet/constants';
import { Web3Wallet } from 'libs/wallet';
import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery, call, apply, take } from 'redux-saga/effects';
import {
  changeNodeForce,
  TypeKeys,
  web3SetNode,
  web3UnsetNode,
  changeNodeIntent
} from 'actions/config';
import {
  getNodeId,
  getStaticAltNodeIdToWeb3,
  getNetworkNameByChainId,
  getNetworkConfig,
  getWeb3Node
} from 'selectors/config';
import { setupWeb3Node, Web3Service, isWeb3Node } from 'libs/nodes/web3';
import { SetWalletAction, setWallet } from 'actions/wallet';
import {
  shepherd,
  makeProviderConfig,
  getShepherdManualMode,
  makeWeb3Network,
  stripWeb3Network,
  shepherdProvider
} from 'libs/nodes';
import { NetworkConfig } from 'shared/types/network';
import { StaticNodeConfig } from 'shared/types/node';
import { showNotification } from 'actions/notifications';
import translate from 'translations';

let web3Added = false;

export function* initWeb3Node(): SagaIterator {
  const { networkId, lib } = yield call(setupWeb3Node);
  const network: string = yield select(getNetworkNameByChainId, networkId);
  const web3Network = makeWeb3Network(network);

  const config: StaticNodeConfig = {
    isCustom: false,
    network: web3Network as any,
    service: Web3Service,
    lib: shepherdProvider,
    estimateGas: false,
    hidden: true
  };

  if (getShepherdManualMode()) {
    yield apply(shepherd, shepherd.auto);
  }

  if (!web3Added) {
    shepherd.useProvider('web3', 'web3', makeProviderConfig({ network: web3Network }));
  }

  web3Added = true;

  yield put(web3SetNode({ id: 'web3', config }));
  return lib;
}

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    const nodeLib = yield call(initWeb3Node);
    yield put(changeNodeIntent('web3'));
    yield take(
      (action: any) =>
        action.type === TypeKeys.CONFIG_NODE_CHANGE && action.payload.nodeId === 'web3'
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

  const network: NetworkConfig = yield select(getNetworkConfig);

  if (getShepherdManualMode()) {
    yield apply(shepherd, shepherd.auto);
  }
  yield apply(shepherd, shepherd.switchNetworks, [stripWeb3Network(network.name)]);

  const altNode = yield select(getStaticAltNodeIdToWeb3);
  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(altNode));
}

export function* unsetWeb3Node(): SagaIterator {
  const node = yield select(getNodeId);

  if (node !== 'web3') {
    return;
  }

  const network: NetworkConfig = yield select(getNetworkConfig);

  if (getShepherdManualMode()) {
    yield apply(shepherd, shepherd.auto);
  }
  yield apply(shepherd, shepherd.switchNetworks, [stripWeb3Network(network.name)]);

  const altNode = yield select(getStaticAltNodeIdToWeb3);
  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(altNode));
}

export const web3 = [
  takeEvery(TypeKeys.CONFIG_NODE_WEB3_UNSET, unsetWeb3Node),
  takeEvery(WalletTypeKeys.WALLET_SET, unsetWeb3NodeOnWalletEvent),
  takeEvery(WalletTypeKeys.WALLET_UNLOCK_WEB3, unlockWeb3)
];
