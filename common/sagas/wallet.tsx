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
import { changeNodeIntent } from 'actions/config';
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
  cps,
  fork,
  put,
  select,
  takeEvery
} from 'redux-saga/effects';
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import { getTokens, getWalletInst } from 'selectors/wallet';
import translate from 'translations';

function* updateAccountBalance(): SagaIterator {
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

// inspired by v3:
// https://github.com/kvhnuke/etherwallet/blob/417115b0ab4dd2033d9108a1a5c00652d38db68d/app/scripts/controllers/decryptWalletCtrl.js#L311
function* unlockWeb3(): SagaIterator {
  const failMsg1 = 'Could not connect to MetaMask / Mist.';
  const failMsg2 = 'No accounts found in MetaMask / Mist.';
  const { web3 } = window as any;

  if (!web3 || !web3.eth) {
    yield put(showNotification('danger', translate(failMsg1)));
    return;
  }

  try {
    yield call(initWeb3Node);

    const network = NODES.web3.network;
    const accounts = yield cps(web3.eth.getAccounts);

    if (!accounts.length) {
      yield put(showNotification('danger', translate(failMsg2)));
      return;
    }

    const address = accounts[0];

    yield put(changeNodeIntent('web3'));
    yield put(setWallet(new Web3Wallet(web3, address, network)));
  } catch (err) {
    console.error(err);
    yield put(showNotification('danger', translate(err.message)));
  }
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
