// @flow
import {
  takeLatest,
  takeEvery,
  select,
  put,
  apply,
  fork,
  // $FlowFixMe - I guarantee you ,it's in there.
  all
} from 'redux-saga/effects';
import HDKey from 'hdkey';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import {
  setDeterministicWallets,
  updateDeterministicWallet
} from 'actions/deterministicWallets';
import { getWallets, getDesiredToken } from 'selectors/deterministicWallets';
import { getNodeLib } from 'selectors/config';
import { getTokens } from 'selectors/wallet';

import type {
  DeterministicWalletData,
  GetDeterministicWalletsAction
} from 'actions/deterministicWallets';
import type { Effect } from 'redux-saga/effects';
import type { BaseNode } from 'libs/nodes';
import type { Token } from 'config/data';

// TODO: BIP39 for mnemonic wallets?
function* getDeterministicWallets(
  action?: GetDeterministicWalletsAction
): Generator<Effect, void, any> {
  if (!action) return;

  const { publicKey, chainCode, limit, offset } = action.payload;
  const hdk = new HDKey();
  hdk.publicKey = new Buffer(publicKey, 'hex');
  hdk.chainCode = new Buffer(chainCode, 'hex');

  const wallets = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`m/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    wallets.push({
      index,
      address: toChecksumAddress(address),
      tokenValues: {}
    });
  }

  yield put(setDeterministicWallets(wallets));
  yield fork(updateWalletValues);
  yield fork(updateWalletTokenValues);
}

// Grab each wallet's main network token, and update it with it
function* updateWalletValues() {
  const node: BaseNode = yield select(getNodeLib);
  const wallets: DeterministicWalletData[] = yield select(getWallets);
  const calls = wallets.map(w => apply(node, node.getBalance, [w.address]));
  const balances = yield all(calls);

  for (let i = 0; i < wallets.length; i++) {
    yield put(
      updateDeterministicWallet({
        ...wallets[i],
        value: balances[i]
      })
    );
  }
}

// Grab the current desired token, and update the wallet with it
function* updateWalletTokenValues() {
  const desiredToken: string = yield select(getDesiredToken);
  if (!desiredToken) return;

  const tokens: Token[] = yield select(getTokens);
  const token = tokens.find(t => t.symbol === desiredToken);
  if (!token) return;

  const node: BaseNode = yield select(getNodeLib);
  const wallets: DeterministicWalletData[] = yield select(getWallets);
  const calls = wallets.map(w => {
    return apply(node, node.getTokenBalance, [w.address, token]);
  });
  const tokenBalances = yield all(calls);

  for (let i = 0; i < wallets.length; i++) {
    yield put(
      updateDeterministicWallet({
        ...wallets[i],
        tokenValues: {
          ...wallets[i].tokenValues,
          [desiredToken]: tokenBalances[i]
        }
      })
    );
  }
}

export default function* deterministicWalletsSaga(): Generator<
  Effect,
  void,
  any
> {
  yield takeLatest('DW_GET_WALLETS', getDeterministicWallets);
  yield takeEvery('DW_SET_DESIRED_TOKEN', updateWalletTokenValues);
}
