import { delay, SagaIterator } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeLatest,
  takeEvery,
  select
} from 'redux-saga/effects';
import { NODES } from 'config/data';
import { Web3Wallet } from 'libs/wallet';
import { getNode, getNodeConfig } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { TypeKeys } from 'actions/config/constants';
import { TypeKeys as WalletTypeKeys } from 'actions/wallet/constants';
import {
  toggleOfflineConfig,
  changeNode,
  changeNodeIntent
} from 'actions/config';
import {
  State as ConfigState,
  INITIAL_STATE as configInitialState
} from 'reducers/config';

export const getConfig = (state: AppState): ConfigState => state.config;

export function* pollOfflineStatus(): SagaIterator {
  while (true) {
    const offline = !navigator.onLine;
    const config = yield select(getConfig);
    const offlineState = config.offline;
    if (offline !== offlineState) {
      yield put(toggleOfflineConfig());
    }
    yield call(delay, 250);
  }
}

// Fork our recurring API call, watch for the need to cancel.
function* handlePollOfflineStatus(): SagaIterator {
  const pollOfflineStatusTask = yield fork(pollOfflineStatus);
  yield take('CONFIG_STOP_POLL_OFFLINE_STATE');
  yield cancel(pollOfflineStatusTask);
}

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
function* reload(): SagaIterator {
  setTimeout(() => location.reload(), 250);
}

function* handleNodeChangeIntent(action): SagaIterator {
  const nodeConfig = yield select(getNodeConfig);
  const currentNetwork = nodeConfig.network;
  const actionNetwork = NODES[action.payload].network;
  const currentWallet = yield select(getWalletInst);

  yield put(changeNode(action.payload));

  // if there's no wallet, do not reload as there's no component state to resync
  if (currentWallet && currentNetwork !== actionNetwork) {
    yield call(reload);
  }
}

// unset web3 as the selected node if a non-web3 wallet has been selected
function* unsetWeb3Node(action): SagaIterator {
  const node = yield select(getNode);
  const nodeConfig = yield select(getNodeConfig);
  const newWallet = action.payload;
  const isWeb3Wallet = newWallet instanceof Web3Wallet;

  if (node !== 'web3' || isWeb3Wallet) {
    return;
  }

  // switch back to a node with the same network as MetaMask/Mist
  const equivalentNode = Object.keys(NODES)
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
  const newNode = equivalentNode.length
    ? equivalentNode
    : configInitialState.nodeSelection;

  yield put(changeNodeIntent(newNode));
}

export default function* configSaga(): SagaIterator {
  yield takeLatest(
    TypeKeys.CONFIG_POLL_OFFLINE_STATUS,
    handlePollOfflineStatus
  );
  yield takeEvery(TypeKeys.CONFIG_NODE_CHANGE_INTENT, handleNodeChangeIntent);
  yield takeEvery(TypeKeys.CONFIG_LANGUAGE_CHANGE, reload);
  yield takeEvery(WalletTypeKeys.WALLET_SET, unsetWeb3Node);
  yield takeEvery(WalletTypeKeys.WALLET_RESET, unsetWeb3Node);
}
