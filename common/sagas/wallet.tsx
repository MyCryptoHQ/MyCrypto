import { showNotification } from 'actions/notifications';
import {
  BroadcastTxRequestedAction,
  setBalance,
  setTokenBalances,
  setWallet,
  UnlockKeystoreAction,
  UnlockMnemonicAction,
  UnlockPrivateKeyAction
} from 'actions/wallet';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { determineKeystoreType } from 'libs/keystore';
import { INode } from 'libs/nodes/INode';
import { Wei } from 'libs/units';
import {
  EncryptedPrivKeyWallet,
  IWallet,
  MewV1Wallet,
  MnemonicWallet,
  PresaleWallet,
  PrivKeyWallet,
  UtcWallet
} from 'libs/wallet/index';
import React from 'react';
import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { Next, Return, Yield } from 'sagas/types';
import { getNodeLib, getNetworkConfig } from 'selectors/config';
import { getTokens, getWalletInst } from 'selectors/wallet';
import translate from 'translations/index';

function* updateAccountBalance(): Generator<Yield, Return, Next> {
  try {
    const wallet: null | IWallet = yield select(getWalletInst);
    if (!wallet) {
      return;
    }
    const node: INode = yield select(getNodeLib);
    const address = yield wallet.getAddress();
    // network request
    const balance: Wei = yield apply(node, node.getBalance, [address]);
    yield put(setBalance(balance));
  } catch (error) {
    yield put({ type: 'updateAccountBalance_error', error });
  }
}

function* updateTokenBalances(): Generator<Yield, Return, Next> {
  try {
    const node: INode = yield select(getNodeLib);
    const wallet: null | IWallet = yield select(getWalletInst);
    const tokens = yield select(getTokens);
    if (!wallet || !node) {
      return;
    }
    // FIXME handle errors
    const address = yield wallet.getAddress();
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
    yield put({ type: 'UPDATE_TOKEN_BALANCE_FAILED', error });
  }
}

function* updateBalances(): Generator<Yield, Return, Next> {
  yield fork(updateAccountBalance);
  yield fork(updateTokenBalances);
}

export function* unlockPrivateKey(
  action?: UnlockPrivateKeyAction
): Generator<Yield, Return, Next> {
  if (!action) {
    return;
  }
  let wallet = null;

  try {
    if (action.payload.key.length === 64) {
      wallet = new PrivKeyWallet(Buffer.from(action.payload.key, 'hex'));
    } else {
      wallet = new EncryptedPrivKeyWallet(
        action.payload.key,
        action.payload.password
      );
    }
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(setWallet(wallet));
}

export function* unlockKeystore(
  action?: UnlockKeystoreAction
): Generator<Yield, Return, Next> {
  if (!action) {
    return;
  }

  const file = action.payload.file;
  const pass = action.payload.password;
  let wallet = null;

  try {
    const parsed = JSON.parse(file);

    switch (determineKeystoreType(file)) {
      case 'presale':
        wallet = new PresaleWallet(file, pass);
        break;
      case 'v1-unencrypted':
        wallet = new PrivKeyWallet(Buffer.from(parsed.private, 'hex'));
        break;
      case 'v1-encrypted':
        wallet = new MewV1Wallet(file, pass);
        break;
      case 'v2-unencrypted':
        wallet = new PrivKeyWallet(Buffer.from(parsed.privKey, 'hex'));
        break;
      case 'v2-v3-utc':
        wallet = new UtcWallet(file, pass);
        break;
      default:
        yield put(showNotification('danger', translate('ERROR_6')));
        return;
    }
  } catch (e) {
    yield put(showNotification('danger', translate('ERROR_6')));
    return;
  }

  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  yield put(setWallet(wallet));
}

function* unlockMnemonic(
  action?: UnlockMnemonicAction
): Generator<Yield, Return, Next> {
  if (!action) {
    return;
  }
  let wallet;
  const { phrase, pass, path, address } = action.payload;

  try {
    wallet = new MnemonicWallet(phrase, pass, path, address);
  } catch (err) {
    // TODO: use better error than 'ERROR_14' (wallet not found)
    yield put(showNotification('danger', translate('ERROR_14')));
    return;
  }

  yield put(setWallet(wallet));
}

function* broadcastTx(
  action: BroadcastTxRequestedAction
): Generator<Yield, Return, Next> {
  const signedTx = action.payload.signedTx;
  try {
    const node: INode = yield select(getNodeLib);
    const network = yield select(getNetworkConfig)
    const txHash = yield apply(node, node.sendRawTx, [signedTx]);
    yield put(
      showNotification('success', <TransactionSucceeded txHash={txHash} blockExplorer={network.blockExplorer} />, 0)
    );
    yield put({
      type: 'WALLET_BROADCAST_TX_SUCCEEDED',
      payload: {
        txHash,
        signedTx
      }
    });
  } catch (error) {
    yield put(showNotification('danger', String(error)));
    yield put({
      type: 'WALLET_BROADCAST_TX_FAILED',
      payload: {
        signedTx,
        error: String(error)
      }
    });
  }
}

export default function* walletSaga(): Generator<Yield, Return, Next> {
  // useful for development
  yield call(updateBalances);
  yield [
    takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey),
    takeEvery('WALLET_UNLOCK_KEYSTORE', unlockKeystore),
    takeEvery('WALLET_UNLOCK_MNEMONIC', unlockMnemonic),
    takeEvery('WALLET_SET', updateBalances),
    takeEvery('CUSTOM_TOKEN_ADD', updateTokenBalances),
    // $FlowFixMe but how do I specify param types here flow?
    takeEvery('WALLET_BROADCAST_TX_REQUESTED', broadcastTx)
  ];
}
