import { showNotification } from 'actions/notifications';
import {
  broadCastTxFailed,
  BroadcastTxRequestedAction,
  broadcastTxSucceded,
  setBalance,
  setTokenBalances,
  setWallet,
  UnlockKeystoreAction,
  UnlockMnemonicAction,
  UnlockPrivateKeyAction
} from 'actions/wallet';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { INode } from 'libs/nodes/INode';
import { Wei } from 'libs/units';
import {
  IWallet,
  MnemonicWallet,
  getPrivKeyWallet,
  getKeystoreWallet
} from 'libs/wallet';
import React from 'react';
import { SagaIterator } from 'redux-saga';
import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import { getTokens, getWalletInst } from 'selectors/wallet';
import translate from 'translations';

function* updateAccountBalance(): SagaIterator {
  try {
    const wallet: null | IWallet = yield select(getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(getNodeLib);
    const address = yield apply(wallet, wallet.getAddressString);
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(setBalance(balance));
  } catch (error) {
    yield put({ type: 'updateAccountBalance_error', error });
  }
}

function* updateTokenBalances(): SagaIterator {
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

function* updateBalances(): SagaIterator {
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

function* unlockMnemonic(action: UnlockMnemonicAction): SagaIterator {
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

function* broadcastTx(action: BroadcastTxRequestedAction): SagaIterator {
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
  // useful for development
  yield call(updateBalances);
  yield [
    takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey),
    takeEvery('WALLET_UNLOCK_KEYSTORE', unlockKeystore),
    takeEvery('WALLET_UNLOCK_MNEMONIC', unlockMnemonic),
    takeEvery('WALLET_SET', updateBalances),
    takeEvery('CUSTOM_TOKEN_ADD', updateTokenBalances),
    takeEvery('WALLET_BROADCAST_TX_REQUESTED', broadcastTx)
  ];
}
