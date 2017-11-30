import { showNotification } from 'actions/notifications';
import {
  broadCastTxFailed,
  BroadcastTxRequestedAction,
  broadcastTxSucceded,
  setBalanceFullfilled,
  setBalancePending,
  setBalanceRejected,
  setTokenBalances,
  setWallet,
  UnlockKeystoreAction,
  UnlockMnemonicAction,
  UnlockPrivateKeyAction
} from 'actions/wallet';
import { Wei } from 'libs/units';
import { changeNodeIntent, web3UnsetNode } from 'actions/config';
import { TypeKeys as ConfigTypeKeys } from 'actions/config/constants';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { INode } from 'libs/nodes/INode';
import {
  IWallet,
  MnemonicWallet,
  getPrivKeyWallet,
  getKeystoreWallet,
  Web3Wallet
} from 'libs/wallet';
import { NODES, initWeb3Node } from 'config/data';
import React from 'react';
import { SagaIterator } from 'redux-saga';
import {
  apply,
  call,
  fork,
  put,
  select,
  takeEvery,
  take
} from 'redux-saga/effects';
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import { getTokens, getWalletInst } from 'selectors/wallet';
import translate from 'translations';
import Web3Node, { isWeb3Node } from 'libs/nodes/web3';

export function* updateAccountBalance(): SagaIterator {
  try {
    yield put(setBalancePending());
    const wallet: null | IWallet = yield select(getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(getNodeLib);
    const address = yield apply(wallet, wallet.getAddressString);
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(setBalanceFullfilled(balance));
  } catch (error) {
    yield put(setBalanceRejected());
  }
}

export function* updateTokenBalances(): SagaIterator {
  try {
    const node: INode = yield select(getNodeLib);
    const wallet: null | IWallet = yield select(getWalletInst);
    const tokens = yield select(getTokens);
    if (!wallet || !node) {
      return;
    }
    // FIXME handle errors
    const address = yield apply(wallet, wallet.getAddressString);

    // network request
    const tokenBalances = yield apply(node, node.getTokenBalances, [
      address,
      tokens
    ]);

    yield put(
      setTokenBalances(
        tokens.reduce((acc, t, i) => {
          acc[t.symbol] = tokenBalances[i];
          return acc;
        }, {})
      )
    );
  } catch (error) {
    console.log(error);
    yield put({ type: 'UPDATE_TOKEN_BALANCE_FAILED', error });
  }
}

export function* updateBalances(): SagaIterator {
  yield fork(updateAccountBalance);
  yield fork(updateTokenBalances);
}

export function* unlockPrivateKey(
  action: UnlockPrivateKeyAction
): SagaIterator {
  let wallet: IWallet | null = null;
  const { key, password } = action.payload;

  try {
    wallet = getPrivKeyWallet(key, password);
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(setWallet(wallet));
}

export function* unlockKeystore(action: UnlockKeystoreAction): SagaIterator {
  const { file, password } = action.payload;
  let wallet: null | IWallet = null;

  try {
    wallet = getKeystoreWallet(file, password);
  } catch (e) {
    yield put(showNotification('danger', translate('ERROR_6')));
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  yield put(setWallet(wallet));
}

export function* unlockMnemonic(action: UnlockMnemonicAction): SagaIterator {
  let wallet;
  const { phrase, pass, path, address } = action.payload;

  try {
    wallet = MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    yield put(showNotification('danger', translate('ERROR_14')));
    return;
  }

  yield put(setWallet(wallet));
}

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
export function* unlockWeb3(): SagaIterator {
  try {
    yield call(initWeb3Node);
    yield put(changeNodeIntent('web3'));
    yield take(
      action =>
        action.type === ConfigTypeKeys.CONFIG_NODE_CHANGE &&
        action.payload.nodeSelection === 'web3'
    );

    const network = NODES.web3.network;
    const nodeLib: INode | Web3Node = yield select(getNodeLib);

    if (!isWeb3Node(nodeLib)) {
      throw new Error('Cannot use Web3 wallet without a Web3 node.');
    }

    const accounts = yield apply(nodeLib, nodeLib.getAccounts);
    const address = accounts[0];

    if (!address) {
      throw new Error('No accounts found in MetaMask / Mist.');
    }
    yield put(setWallet(new Web3Wallet(address, network)));
  } catch (err) {
    // unset web3 node so node dropdown isn't disabled
    yield put(web3UnsetNode());
    yield put(showNotification('danger', translate(err.message)));
  }
}

export function* broadcastTx(action: BroadcastTxRequestedAction): SagaIterator {
  const signedTx = action.payload.signedTx;
  try {
    const node: INode = yield select(getNodeLib);
    const network = yield select(getNetworkConfig);
    const txHash = yield apply(node, node.sendRawTx, [signedTx]);
    yield put(
      showNotification(
        'success',
        <TransactionSucceeded
          txHash={txHash}
          blockExplorer={network.blockExplorer}
        />,
        0
      )
    );
    yield put(broadcastTxSucceded(txHash, signedTx));
  } catch (error) {
    yield put(showNotification('danger', error.message));
    yield put(broadCastTxFailed(signedTx, error.message));
  }
}

export default function* walletSaga(): SagaIterator {
  yield [
    takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey),
    takeEvery('WALLET_UNLOCK_KEYSTORE', unlockKeystore),
    takeEvery('WALLET_UNLOCK_MNEMONIC', unlockMnemonic),
    takeEvery('WALLET_UNLOCK_WEB3', unlockWeb3),
    takeEvery('WALLET_SET', updateBalances),
    takeEvery('CUSTOM_TOKEN_ADD', updateTokenBalances),
    takeEvery('WALLET_BROADCAST_TX_REQUESTED', broadcastTx)
  ];
}
