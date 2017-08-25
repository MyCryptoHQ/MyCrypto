// @flow
import {
  takeLatest,
  takeEvery,
  select,
  put,
  apply,
  fork,
  all
} from 'redux-saga/effects';
import HDKey from 'hdkey';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import { setDerivedWallets, updateDerivedWallet } from 'actions/derivedWallets';
import { getWallets, getDesiredToken } from 'selectors/derivedWallets';
import { getNodeLib } from 'selectors/config';

import type {
  DerivedWallet,
  GetDerivedWalletsAction
} from 'actions/derivedWallets';
import type { Effect } from 'redux-saga/effects';
import type { BaseNode } from 'libs/nodes';

function* getDerivedWallets(
  action?: GetDerivedWalletsAction
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

  yield put(setDerivedWallets(wallets));
  yield fork(updateWalletValues);
  yield fork(updateWalletTokenValues);
}

// Grab each wallet's main network token, and update it with it
function* updateWalletValues() {
  const node: BaseNode = yield select(getNodeLib);
  const wallets: DerivedWallet[] = yield select(getWallets);
  const calls = wallets.map(w => apply(node, node.getBalance, [w.address]));
  const balances = yield all(calls);

  for (let i = 0; i < wallets.length; i++) {
    yield put(
      updateDerivedWallet({
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

  const node: BaseNode = yield select(getNodeLib);
  const wallets: DerivedWallet[] = yield select(getWallets);
  const calls = wallets.map(w =>
    // $FlowFixMe
    apply(node, node.getTokenBalances, [w.desiredToken])
  );
  const tokenBalances = yield all(calls);

  console.log(tokenBalances, 'tokenBalances');
  for (let i = 0; i < wallets.length; i++) {
    yield put(
      updateDerivedWallet({
        ...wallets[i],
        tokenValues: {
          ...wallets[i].tokenValues,
          [desiredToken]: tokenBalances[i]
        }
      })
    );
  }
}

export default function* derivedWalletsSaga(): Generator<Effect, void, any> {
  yield takeLatest('DERIVED_WALLETS_GET_WALLETS', getDerivedWallets);
  yield takeEvery('DERIVED_WALLETS_SET_DESIRED_TOKEN', updateWalletTokenValues);
}
