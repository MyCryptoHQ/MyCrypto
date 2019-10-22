import { SagaIterator } from 'redux-saga';
import { all, apply, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';

import { translateRaw } from 'translations';
import { INode } from 'libs/nodes/INode';
import { TokenValue } from 'libs/units';
import { Token } from 'types/network';
import * as derivedSelectors from 'features/selectors';
import { configSelectors, configNodesSelectors } from 'features/config';
import { notificationsActions } from 'features/notifications';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export function* getDeterministicWalletsSaga(
  action: types.GetDeterministicWalletsAction
): SagaIterator {
  const { seed, dPath, publicKey, chainCode, limit, offset } = action.payload;
  let pathBase;
  let hdk;

  // if seed present, treat as mnemonic
  // if pubKey & chainCode present, treat as HW wallet

  if (seed) {
    hdk = HDKey.fromMasterSeed(new Buffer(seed, 'hex'));
    pathBase = dPath;
  } else if (publicKey && chainCode) {
    hdk = new HDKey();
    hdk.publicKey = new Buffer(publicKey, 'hex');
    hdk.chainCode = new Buffer(chainCode, 'hex');
    pathBase = 'm';
  } else {
    return;
  }
  const wallets: types.DeterministicWalletData[] = [];
  const toChecksumAddress: ReturnType<typeof configSelectors.getChecksumAddressFn> = yield select(
    configSelectors.getChecksumAddressFn
  );
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

  yield put(actions.setDeterministicWallets(wallets));
  yield fork(updateWalletValues);
  yield fork(updateWalletTokenValues);
}

// Grab each wallet's main network token, and update it with it
export function* updateWalletValues(): SagaIterator {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const wallets: types.DeterministicWalletData[] = yield select(selectors.getWallets);

  try {
    const calls = wallets.map(w => apply(node, node.getBalance, [w.address]));
    const balances = yield all(calls);

    for (let i = 0; i < wallets.length; i++) {
      yield put(
        actions.updateDeterministicWallet({
          ...wallets[i],
          value: balances[i]
        })
      );
    }
  } catch (err) {
    console.error(err);
    yield put(notificationsActions.showNotification('danger', translateRaw('ERROR_32')));
  }
}

// Grab the current desired token, and update the wallet with it
export function* updateWalletTokenValues(): SagaIterator {
  const desiredToken: string = yield select(selectors.getDesiredToken);
  if (!desiredToken) {
    return;
  }

  const tokens: Token[] = yield select(derivedSelectors.getTokens);
  const token = tokens.find(t => t.symbol === desiredToken);
  if (!token) {
    return;
  }

  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const wallets: types.DeterministicWalletData[] = yield select(selectors.getWallets);

  try {
    const calls = wallets.map(w => {
      return apply(node, node.getTokenBalance, [w.address, token]);
    });
    const tokenBalances: { balance: TokenValue; error: string | null }[] = yield all(calls);

    for (let i = 0; i < wallets.length; i++) {
      if (!tokenBalances[i].error) {
        yield put(
          actions.updateDeterministicWallet({
            ...wallets[i],
            tokenValues: {
              ...wallets[i].tokenValues,
              [desiredToken]: {
                value: tokenBalances[i].balance,
                decimal: token.decimal
              }
            }
          })
        );
      }
    }
  } catch (err) {
    console.error(err);
    yield put(notificationsActions.showNotification('danger', translateRaw('ERROR_32')));
  }
}

export function* deterministicWalletsSaga(): SagaIterator {
  yield takeLatest('DETERMINISTIC_WALLETS_GET_WALLETS', getDeterministicWalletsSaga);
  yield takeEvery('DETERMINISTIC_WALLETS_UPDATE_WALLET', updateWalletTokenValues);
}
