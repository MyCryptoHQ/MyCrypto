// @flow
import { takeEvery, call, apply, put, select, fork } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { setWallet, setBalance, setTokenBalances } from 'actions/wallet';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import { showNotification } from 'actions/notifications';
import translate from 'translations';
import { PrivKeyWallet, BaseWallet } from 'libs/wallet';
import { BaseNode } from 'libs/nodes';
import { getNodeLib } from 'selectors/config';
import { getWalletInst, getTokens } from 'selectors/wallet';
import Big from 'big.js';

// FIXME MOVE ME
function padLeft(n: string, width: number, z: string = '0'): string {
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getEthCallData(to: string, method: string, args: string[]) {
  return {
    to,
    data: method + args.map(a => padLeft(a, 64)).join()
  };
}

function* updateAccountBalance() {
  const node: BaseNode = yield select(getNodeLib);
  const wallet: ?BaseWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }
  let balance = yield apply(node, node.getBalance, [wallet.getAddress()]);
  yield put(setBalance(balance));
}

function* updateTokenBalances() {
  const node = yield select(getNodeLib);
  const wallet: ?BaseWallet = yield select(getWalletInst);
  const tokens = yield select(getTokens);
  if (!wallet) {
    return;
  }
  const requests = tokens.map(token =>
    getEthCallData(token.address, '0x70a08231', [wallet.getNakedAddress()])
  );
  // FIXME handle errors
  const tokenBalances = yield apply(node, node.ethCall, [requests]);
  yield put(
    setTokenBalances(
      tokens.reduce((acc, t, i) => {
        // FIXME
        if (tokenBalances[i].error || tokenBalances[i].result === '0x') {
          return acc;
        }
        let balance = Big(Number(tokenBalances[i].result)).div(Big(10).pow(t.decimal)); // definitely not safe
        acc[t.symbol] = balance;
        return acc;
      }, {})
    )
  );
}

function* updateBalances() {
  yield fork(updateAccountBalance);
  yield fork(updateTokenBalances);
}

export function* unlockPrivateKey(action?: UnlockPrivateKeyAction): Generator<Effect, void, any> {
  if (!action) return;
  let wallet = null;

  try {
    wallet = new PrivKeyWallet(action.payload);
  } catch (e) {
    yield put(showNotification('danger', translate('INVALID_PKEY')));
    return;
  }
  yield put(setWallet(wallet));
  yield call(updateBalances);
}

export default function* walletSaga(): Generator<Effect | Effect[], void, any> {
  // useful for development
  yield call(updateBalances);
  yield [
    takeEvery('WALLET_UNLOCK_PRIVATE_KEY', unlockPrivateKey),
    takeEvery('CUSTOM_TOKEN_ADD', updateTokenBalances)
  ];
}
