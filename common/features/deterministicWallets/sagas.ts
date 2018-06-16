import { SagaIterator } from 'redux-saga';
import { all, apply, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';

import translate from 'translations';
import { INode } from 'libs/nodes/INode';
import { TokenValue } from 'libs/units';
import { Token } from 'types/network';
import * as selectors from 'features/selectors';
import { getChecksumAddressFn } from 'features/config';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as deterministicWalletsTypes from './types';
import * as deterministicWalletsActions from './actions';
import * as deterministicWalletsSelectors from './selectors';

export function* getDeterministicWalletsSaga(
  action: deterministicWalletsTypes.GetDeterministicWalletsAction
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
  const wallets: deterministicWalletsTypes.DeterministicWalletData[] = [];
  const toChecksumAddress: ReturnType<typeof getChecksumAddressFn> = yield select(
    getChecksumAddressFn
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

  yield put(deterministicWalletsActions.setDeterministicWallets(wallets));
  yield fork(updateWalletValues);
  yield fork(updateWalletTokenValues);
}

// Grab each wallet's main network token, and update it with it
export function* updateWalletValues(): SagaIterator {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const wallets: deterministicWalletsTypes.DeterministicWalletData[] = yield select(
    deterministicWalletsSelectors.getWallets
  );

  try {
    const calls = wallets.map(w => apply(node, node.getBalance, [w.address]));
    const balances = yield all(calls);

    for (let i = 0; i < wallets.length; i++) {
      yield put(
        deterministicWalletsActions.updateDeterministicWallet({
          ...wallets[i],
          value: balances[i]
        })
      );
    }
  } catch (err) {
    console.log(err);
    yield put(notificationsActions.showNotification('danger', translate('ERROR_32')));
  }
}

// Grab the current desired token, and update the wallet with it
export function* updateWalletTokenValues(): SagaIterator {
  const desiredToken: string = yield select(deterministicWalletsSelectors.getDesiredToken);
  if (!desiredToken) {
    return;
  }

  const tokens: Token[] = yield select(selectors.getTokens);
  const token = tokens.find(t => t.symbol === desiredToken);
  if (!token) {
    return;
  }

  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const wallets: deterministicWalletsTypes.DeterministicWalletData[] = yield select(
    deterministicWalletsSelectors.getWallets
  );

  try {
    const calls = wallets.map(w => {
      return apply(node, node.getTokenBalance, [w.address, token]);
    });
    const tokenBalances: { balance: TokenValue; error: string | null }[] = yield all(calls);

    for (let i = 0; i < wallets.length; i++) {
      if (!tokenBalances[i].error) {
        yield put(
          deterministicWalletsActions.updateDeterministicWallet({
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
    console.log(err);
    yield put(notificationsActions.showNotification('danger', translate('ERROR_32')));
  }
}

export function* deterministicWalletsSaga(): SagaIterator {
  yield takeLatest('DETERMINISTIC_WALLETS_GET_WALLETS', getDeterministicWalletsSaga);
  yield takeEvery('DETERMINISTIC_WALLETS_UPDATE_WALLET', updateWalletTokenValues);
}
