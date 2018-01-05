import {
  DeterministicWalletData,
  GetDeterministicWalletsAction,
  setDeterministicWallets,
  updateDeterministicWallet
} from 'actions/deterministicWallets';
import { showNotification } from 'actions/notifications';
import { Token } from 'config/data';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import { INode } from 'libs/nodes/INode';
import { SagaIterator } from 'redux-saga';
import { all, apply, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import { getDesiredToken, getWallets } from 'selectors/deterministicWallets';
import { getTokens } from 'selectors/wallet';
import translate from 'translations';
import { TokenValue } from 'libs/units';

export function* getDeterministicWallets(action: GetDeterministicWalletsAction): SagaIterator {
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
  const wallets: DeterministicWalletData[] = [];
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
export function* updateWalletValues(): SagaIterator {
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
export function* updateWalletTokenValues(): SagaIterator {
  const desiredToken: string = yield select(getDesiredToken);
  if (!desiredToken) {
    return;
  }

  const tokens: Token[] = yield select(getTokens);
  const token = tokens.find(t => t.symbol === desiredToken);
  if (!token) {
    return;
  }

  const node: INode = yield select(getNodeLib);
  const wallets: DeterministicWalletData[] = yield select(getWallets);

  try {
    const calls = wallets.map(w => {
      return apply(node, node.getTokenBalance, [w.address, token]);
    });
    const tokenBalances: { balance: TokenValue; error: string | null } = yield all(calls);

    for (let i = 0; i < wallets.length; i++) {
      if (!tokenBalances[i].error) {
        yield put(
          updateDeterministicWallet({
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
    yield put(showNotification('danger', translate('ERROR_32')));
  }
}

export default function* deterministicWalletsSaga(): SagaIterator {
  yield takeLatest('DW_GET_WALLETS', getDeterministicWallets);
  yield takeEvery('DW_SET_DESIRED_TOKEN', updateWalletTokenValues);
}
