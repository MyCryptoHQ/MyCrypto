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
import type {
  DeterministicWalletData,
  GetDeterministicWalletsAction
} from 'actions/deterministicWallets';

import type { Yield, Return, Next } from 'sagas/types';

import { getWallets, getDesiredToken } from 'selectors/deterministicWallets';
import { getNodeLib } from 'selectors/config';
import { getTokens } from 'selectors/wallet';

import type { INode } from 'libs/nodes/INode';
import type { Token } from 'config/data';

import { showNotification } from 'actions/notifications';
import translate from 'translations';

function* getDeterministicWallets(
  action?: GetDeterministicWalletsAction
): Generator<Yield, Return, Next> {
  if (!action) return;

  const { seed, dPath, publicKey, chainCode, limit, offset } = action.payload;
  let pathBase, hdk;

  //if seed present, treat as mnemonic
  //if pubKey & chainCode present, treat as HW wallet

  if (seed) {
    hdk = HDKey.fromMasterSeed(new Buffer(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = new Buffer(publicKey, 'hex');
    hdk.chainCode = new Buffer(chainCode, 'hex');
    pathBase = 'm';
  } else return;

  const wallets = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dkey = hdk.derive(`${pathBase}/${index}`);
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
function* updateWalletValues(): Generator<Yield, Return, Next> {
  const node: INode = yield select(getNodeLib);
  const wallets: DeterministicWalletData[] = yield select(getWallets);

  try {
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
  } catch (err) {
    console.log(err);
    yield put(showNotification('danger', translate('ERROR_32')));
  }
}

// Grab the current desired token, and update the wallet with it
function* updateWalletTokenValues(): Generator<Yield, Return, Next> {
  const desiredToken: string = yield select(getDesiredToken);
  if (!desiredToken) return;

  const tokens: Token[] = yield select(getTokens);
  const token = tokens.find(t => t.symbol === desiredToken);
  if (!token) return;

  const node: INode = yield select(getNodeLib);
  const wallets: DeterministicWalletData[] = yield select(getWallets);

  try {
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
  } catch (err) {
    console.log(err);
    yield put(showNotification('danger', translate('ERROR_32')));
  }
}

export default function* deterministicWalletsSaga(): Generator<
  Yield,
  Return,
  Next
> {
  yield takeLatest('DW_GET_WALLETS', getDeterministicWallets);
  yield takeEvery('DW_SET_DESIRED_TOKEN', updateWalletTokenValues);
}
