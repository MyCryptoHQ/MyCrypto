import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeLatest,
  takeEvery,
  select,
  race
} from 'redux-saga/effects';
import { NODES, NETWORKS, NodeConfig, CustomNodeConfig, CustomNetworkConfig } from 'config/data';
import {
  makeCustomNodeId,
  getCustomNodeConfigFromId,
  makeNodeConfigFromCustomConfig
} from 'utils/node';
import { makeCustomNetworkId, getNetworkConfigFromId } from 'utils/network';
import {
  getNode,
  getNodeConfig,
  getCustomNodeConfigs,
  getCustomNetworkConfigs,
  getOffline
} from 'selectors/config';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import {
  toggleOfflineConfig,
  changeNode,
  changeNodeIntent,
  setLatestBlock,
  removeCustomNetwork,
  AddCustomNodeAction,
  ChangeNodeIntentAction
} from 'actions/config';
import { showNotification } from 'actions/notifications';
import { translateRaw } from 'translations';
import { IWallet, Web3Wallet } from 'libs/wallet';
import { getWalletInst } from 'selectors/wallet';
import { TypeKeys as WalletTypeKeys } from 'actions/wallet/constants';
import { State as ConfigState, INITIAL_STATE as configInitialState } from 'reducers/config';
import { resetWallet } from 'actions/wallet';
import { reset as resetTransaction } from 'actions/transaction';

export const getConfig = (state: AppState): ConfigState => state.config;

let hasCheckedOnline = false;
export function* pollOfflineStatus(): SagaIterator {
  while (true) {
    const node: NodeConfig = yield select(getNodeConfig);
    const isOffline: boolean = yield select(getOffline);

    // If our offline state disagrees with the browser, run a check
    // Don't check if the user is in another tab or window
    const shouldPing = !hasCheckedOnline || navigator.onLine === isOffline;
    if (shouldPing && !document.hidden) {
      const { pingSucceeded } = yield race({
        pingSucceeded: call(node.lib.ping.bind(node.lib)),
        timeout: call(delay, 5000)
      });

      if (pingSucceeded && isOffline) {
        // If we were able to ping but redux says we're offline, mark online
        yield put(
          showNotification('success', 'Your connection to the network has been restored!', 3000)
        );
        yield put(toggleOfflineConfig());
      } else if (!pingSucceeded && !isOffline) {
        // If we were unable to ping but redux says we're online, mark offline
        // If they had been online, show an error.
        // If they hadn't been online, just inform them with a warning.
        if (hasCheckedOnline) {
          yield put(
            showNotification(
              'danger',
              `You’ve lost your connection to the network, check your internet
              connection or try changing networks from the dropdown at the
              top right of the page.`,
              Infinity
            )
          );
        } else {
          yield put(
            showNotification(
              'info',
              'You are currently offline. Some features will be unavailable.',
              5000
            )
          );
        }
        yield put(toggleOfflineConfig());
      } else {
        // If neither case was true, try again in 5s
        yield call(delay, 5000);
      }
      hasCheckedOnline = true;
    } else {
      yield call(delay, 1000);
    }
  }
}

// Fork our recurring API call, watch for the need to cancel.
export function* handlePollOfflineStatus(): SagaIterator {
  const pollOfflineStatusTask = yield fork(pollOfflineStatus);
  yield take('CONFIG_STOP_POLL_OFFLINE_STATE');
  yield cancel(pollOfflineStatusTask);
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
export function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 1150);
}

export function* handleNodeChangeIntent(action: ChangeNodeIntentAction): SagaIterator {
  const currentNode: string = yield select(getNode);
  const currentConfig: NodeConfig = yield select(getNodeConfig);
  const customNets: CustomNetworkConfig[] = yield select(getCustomNetworkConfigs);
  const currentNetwork =
    getNetworkConfigFromId(currentConfig.network, customNets) || NETWORKS[currentConfig.network];

  function* bailOut(message: string) {
    yield put(showNotification('danger', message, 5000));
    yield put(changeNode(currentNode, currentConfig, currentNetwork));
  }

  let actionConfig = NODES[action.payload];
  if (!actionConfig) {
    const customConfigs: CustomNodeConfig[] = yield select(getCustomNodeConfigs);
    const config = getCustomNodeConfigFromId(action.payload, customConfigs);
    if (config) {
      actionConfig = makeNodeConfigFromCustomConfig(config);
    }
  }

  if (!actionConfig) {
    return yield* bailOut(`Attempted to switch to unknown node '${action.payload}'`);
  }

  // Grab latest block from the node, before switching, to confirm it's online
  // Give it 5 seconds before we call it offline
  let latestBlock;
  let timeout;
  try {
    const { lb, to } = yield race({
      lb: call(actionConfig.lib.getCurrentBlock.bind(actionConfig.lib)),
      to: call(delay, 5000)
    });
    latestBlock = lb;
    timeout = to;
  } catch (err) {
    // Whether it times out or errors, same message
    timeout = true;
  }

  if (timeout) {
    return yield* bailOut(translateRaw('ERROR_32'));
  }

  const actionNetwork = getNetworkConfigFromId(actionConfig.network, customNets);

  if (!actionNetwork) {
    return yield* bailOut(
      `Unknown custom network for your node '${action.payload}', try re-adding it`
    );
  }

  yield put(setLatestBlock(latestBlock));
  yield put(changeNode(action.payload, actionConfig, actionNetwork));

  const currentWallet: IWallet | null = yield select(getWalletInst);

  // if there's no wallet, do not reload as there's no component state to resync
  if (currentWallet && currentConfig.network !== actionConfig.network) {
    yield put(resetWallet());
    yield put(resetTransaction());
  }
}

export function* switchToNewNode(action: AddCustomNodeAction): SagaIterator {
  const nodeId = makeCustomNodeId(action.payload);
  yield put(changeNodeIntent(nodeId));
}

// If there are any orphaned custom networks, purge them
export function* cleanCustomNetworks(): SagaIterator {
  const customNodes = yield select(getCustomNodeConfigs);
  const customNetworks = yield select(getCustomNetworkConfigs);
  const networksInUse = customNodes.reduce((prev, conf) => {
    prev[conf.network] = true;
    return prev;
  }, {});

  for (const net of customNetworks) {
    if (!networksInUse[makeCustomNetworkId(net)]) {
      yield put(removeCustomNetwork(net));
    }
  }
}

// unset web3 as the selected node if a non-web3 wallet has been selected
export function* unsetWeb3NodeOnWalletEvent(action): SagaIterator {
  const node = yield select(getNode);
  const nodeConfig = yield select(getNodeConfig);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  // switch back to a node with the same network as MetaMask/Mist
  yield put(changeNodeIntent(equivalentNodeOrDefault(nodeConfig)));
}

export function* unsetWeb3Node(): SagaIterator {
  const node = yield select(getNode);

  if (node !== 'web3') {
    return;
  }

  const nodeConfig: NodeConfig = yield select(getNodeConfig);
  const newNode = equivalentNodeOrDefault(nodeConfig);

  yield put(changeNodeIntent(newNode));
}

export const equivalentNodeOrDefault = (nodeConfig: NodeConfig) => {
  const node = Object.keys(NODES)
    .filter(key => key !== 'web3')
    .reduce((found, key) => {
      const config = NODES[key];
      if (found.length) {
        return found;
      }
      if (nodeConfig.network === config.network) {
        return (found = key);
      }
      return found;
    }, '');

  // if no equivalent node was found, use the app default
  return node.length ? node : configInitialState.nodeSelection;
};

export default function* configSaga(): SagaIterator {
  yield takeLatest(TypeKeys.CONFIG_POLL_OFFLINE_STATUS, handlePollOfflineStatus);
  yield takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent);
  yield takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload);
  yield takeEvery(TypeKeys.CONFIG_ADD_CUSTOM_NODE, switchToNewNode);
  yield takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, cleanCustomNetworks);
  yield takeEvery(TypeKeys.CONFIG_NODE_WEB3_UNSET, unsetWeb3Node);
  yield takeEvery(WalletTypeKeys.WALLET_SET, unsetWeb3NodeOnWalletEvent);
  yield takeEvery(WalletTypeKeys.WALLET_RESET, unsetWeb3NodeOnWalletEvent);
}
