import { SagaIterator, delay } from 'redux-saga';
import {
  all,
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
  select,
  apply,
  takeLatest
} from 'redux-saga/effects';

import translate, { translateRaw } from 'translations';
import {
  getShepherdOffline,
  isAutoNode,
  getShepherdNetwork,
  getShepherdPending,
  shepherd,
  makeProviderConfig,
  getShepherdManualMode,
  makeWeb3Network,
  stripWeb3Network,
  shepherdProvider
} from 'libs/nodes';
import { Web3Wallet } from 'libs/wallet';
import { setupWeb3Node, Web3Service, isWeb3Node } from 'libs/nodes/web3';
import { StaticNodeConfig, CustomNodeConfig, NodeConfig } from 'types/node';
import { CustomNetworkConfig, StaticNetworkConfig } from 'types/network';
import { AppState } from 'redux/reducers';
import { showNotification } from 'redux/notifications/actions';
import { TypeKeys as WalletTypeKeys, SetWalletAction } from 'redux/wallet/types';
import { resetWallet, setWallet } from 'redux/wallet/actions';
import {
  TypeKeys,
  AddCustomNodeAction,
  ChangeNodeForceAction,
  ChangeNodeIntentAction,
  ChangeNodeIntentOneTimeAction
} from './types';
import {
  removeCustomNetwork,
  setOnline,
  setOffline,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  changeNodeForce,
  web3SetNode,
  web3UnsetNode
} from './actions';
import {
  getCustomNodeConfigs,
  getCustomNetworkConfigs,
  getNodeId,
  getNodeConfig,
  getOffline,
  isStaticNodeId,
  getCustomNodeFromId,
  getStaticNodeFromId,
  getNetworkConfigById,
  getPreviouslySelectedNode,
  getNetworkNameByChainId,
  getWeb3Node
} from './selectors';

//#region Network
// If there are any orphaned custom networks, prune them
export function* pruneCustomNetworks(): SagaIterator {
  const customNodes: AppState['config']['nodes']['customNodes'] = yield select(
    getCustomNodeConfigs
  );
  const customNetworks: AppState['config']['networks']['customNetworks'] = yield select(
    getCustomNetworkConfigs
  );

  //construct lookup table of networks

  const linkedNetworks: { [key: string]: boolean } = Object.values(customNodes).reduce(
    (networkMap, currentNode) => ({ ...networkMap, [currentNode.network]: true }),
    {}
  );

  for (const currNetwork of Object.keys(customNetworks)) {
    if (!linkedNetworks[currNetwork]) {
      yield put(removeCustomNetwork({ id: currNetwork }));
    }
  }
}

export const network = [takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, pruneCustomNetworks)];
//#endregion Network

//#region Node
export function* pollOfflineStatusSaga(): SagaIterator {
  let hasCheckedOnline = false;

  const restoreNotif = showNotification(
    'success',
    'Your connection to the network has been restored!',
    3000
  );
  const lostNetworkNotif = showNotification(
    'danger',
    `You’ve lost your connection to the network, check your internet connection or try changing networks from the dropdown at the top right of the page.`,
    Infinity
  );
  const offlineNotif = showNotification(
    'info',
    'You are currently offline. Some features will be unavailable.',
    5000
  );

  while (true) {
    yield call(delay, 2500);

    const pending: ReturnType<typeof getShepherdPending> = yield call(getShepherdPending);
    if (pending) {
      continue;
    }

    const isOffline: boolean = yield select(getOffline);
    const balancerOffline = yield call(getShepherdOffline);

    if (!balancerOffline && isOffline) {
      // If we were able to ping but redux says we're offline, mark online
      yield put(restoreNotif);
      yield put(setOnline());
    } else if (balancerOffline && !isOffline) {
      // If we were unable to ping but redux says we're online, mark offline
      // If they had been online, show an error.
      // If they hadn't been online, just inform them with a warning.
      yield put(setOffline());
      if (hasCheckedOnline) {
        yield put(lostNetworkNotif);
      } else {
        yield put(offlineNotif);
      }
    }
    hasCheckedOnline = true;
  }
}

// Fork our recurring API call, watch for the need to cancel.
export function* handlePollOfflineStatus(): SagaIterator {
  const pollOfflineStatusTask = yield fork(pollOfflineStatusSaga);
  yield take('CONFIG_STOP_POLL_OFFLINE_STATE');
  yield cancel(pollOfflineStatusTask);
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
export function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 1150);
}

export function* handleNodeChangeIntentOneTime(): SagaIterator {
  const action: ChangeNodeIntentOneTimeAction = yield take(
    TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME
  );
  // allow shepherdProvider async init to complete. TODO - don't export shepherdProvider as promise
  yield call(delay, 100);
  yield put(changeNodeIntent(action.payload));
}

export function* handleNodeChangeIntent({
  payload: nodeIdToSwitchTo
}: ChangeNodeIntentAction): SagaIterator {
  const isStaticNode: boolean = yield select(isStaticNodeId, nodeIdToSwitchTo);
  const currentConfig: NodeConfig = yield select(getNodeConfig);

  function* bailOut(message: string) {
    const currentNodeId: string = yield select(getNodeId);
    yield put(showNotification('danger', message, 5000));
    yield put(changeNode({ networkId: currentConfig.network, nodeId: currentNodeId }));
  }

  let nextNodeConfig: CustomNodeConfig | StaticNodeConfig;

  if (!isStaticNode) {
    const config: CustomNodeConfig | undefined = yield select(
      getCustomNodeFromId,
      nodeIdToSwitchTo
    );

    if (config) {
      nextNodeConfig = config;
    } else {
      return yield* bailOut(`Attempted to switch to unknown node '${nodeIdToSwitchTo}'`);
    }
  } else {
    nextNodeConfig = yield select(getStaticNodeFromId, nodeIdToSwitchTo);
  }

  const nextNetwork: StaticNetworkConfig | CustomNetworkConfig = yield select(
    getNetworkConfigById,
    stripWeb3Network(nextNodeConfig.network)
  );

  if (!nextNetwork) {
    return yield* bailOut(
      `Unknown custom network for your node '${nodeIdToSwitchTo}', try re-adding it`
    );
  }

  const isOffline = yield select(getOffline);
  if (isAutoNode(nodeIdToSwitchTo)) {
    shepherd.auto();
    if (getShepherdNetwork() !== nextNodeConfig.network) {
      yield apply(shepherd, shepherd.switchNetworks, [nextNodeConfig.network]);
    }
  } else {
    try {
      yield apply(shepherd, shepherd.manual, [nodeIdToSwitchTo, isOffline]);
    } catch (err) {
      console.error(err);
      return yield* bailOut(translateRaw('ERROR_32'));
    }
  }

  let currentBlock = '???';
  try {
    currentBlock = yield apply(shepherdProvider, shepherdProvider.getCurrentBlock);
  } catch (err) {
    if (!isOffline) {
      console.error(err);
      return yield* bailOut(translateRaw('ERROR_32'));
    }
  }

  yield put(setLatestBlock(currentBlock));
  yield put(changeNode({ networkId: nextNodeConfig.network, nodeId: nodeIdToSwitchTo }));

  if (currentConfig.network !== nextNodeConfig.network) {
    yield fork(handleNewNetwork);
  }
}

export function* handleAddCustomNode(action: AddCustomNodeAction): SagaIterator {
  const { payload: { config } } = action;
  shepherd.useProvider(
    'myccustom',
    config.id,
    makeProviderConfig({ network: config.network }),
    config
  );
  yield put(changeNodeIntent(action.payload.id));
}

export function* handleNewNetwork() {
  yield put(resetWallet());
}

export function* handleNodeChangeForce({ payload: staticNodeIdToSwitchTo }: ChangeNodeForceAction) {
  // does not perform node online check before changing nodes
  // necessary when switching back from Web3 provider so node
  // dropdown does not get stuck if node is offline

  const isStaticNode: boolean = yield select(isStaticNodeId, staticNodeIdToSwitchTo);

  if (!isStaticNode) {
    return;
  }

  const nodeConfig = yield select(getStaticNodeFromId, staticNodeIdToSwitchTo);

  // force the node change
  yield put(changeNode({ networkId: nodeConfig.network, nodeId: staticNodeIdToSwitchTo }));

  // also put the change through as usual so status check and
  // error messages occur if the node is unavailable
  yield put(changeNodeIntent(staticNodeIdToSwitchTo));
}

export const node = [
  fork(handleNodeChangeIntentOneTime),
  takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent),
  takeEvery(TypeKeys.CONFIG_NODE_CHANGE_FORCE, handleNodeChangeForce),
  takeLatest(TypeKeys.CONFIG_POLL_OFFLINE_STATUS, handlePollOfflineStatus),
  takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload),
  takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, handleAddCustomNode)
];
//#endregion Node

//#region web3
let web3Added = false;

export function* initWeb3Node(): SagaIterator {
  const { networkId, lib } = yield call(setupWeb3Node);
  const networkName: string = yield select(getNetworkNameByChainId, networkId);
  const web3Network = makeWeb3Network(networkName);

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
    const web3Network = web3Node.network;

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts: string = yield apply(nodeLib, nodeLib.getAccounts);
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Mist.');
    }
    const wallet = new Web3Wallet(address, stripWeb3Network(web3Network));
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
  const nodeId = yield select(getNodeId);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (nodeId !== 'web3' || isWeb3Wallet) {
    return;
  }

  const prevNodeId: string = yield select(getPreviouslySelectedNode);

  // forcefully switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeForce(prevNodeId));
}

export function* unsetWeb3Node(): SagaIterator {
  const nodeId = yield select(getNodeId);

  if (nodeId !== 'web3') {
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
//#endregion web3

export function* configSaga(): SagaIterator {
  yield all([...network, ...node, ...web3]);
}
