import { BalanceMap } from '@mycrypto/eth-scan';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Asset, AssetBalanceObject, IAccount, Network, TAddress } from '@types';
import {
  generateAssetUUID,
  generateDeterministicAddressUUID,
  isSameAddress,
  mapAsync
} from '@utils';
import { eqBy, identity, mergeAll, prop, unionWith } from '@vendor';

import { getBaseAssetBalancesForAddresses, getTokenBalancesForAddresses } from '../BalanceService';
import { getAccounts, updateAccountAssets } from './account.slice';
import { getAssets } from './asset.slice';
import { selectNetworks } from './network.slice';
import { AppState } from './root.reducer';

export const initialState = {
  scanning: false
};

const slice = createSlice({
  name: 'tokenScanning',
  initialState,
  reducers: {
    startTokenScan(state) {
      state.scanning = true;
    },
    finishTokenScan(state) {
      state.scanning = false;
    }
  }
});

export const scanTokens = createAction<{ accounts?: IAccount[]; assets?: Asset[] } | undefined>(
  `${slice.name}/scanTokens`
);

export const { startTokenScan, finishTokenScan } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const isScanning = createSelector(
  (state: AppState) => state.tokenScanning.scanning,
  identity
);

/**
 * Sagas
 */
export function* scanTokensSaga() {
  yield takeLatest(scanTokens.type, scanTokensWorker);
}

const fetchBalances = async (networks: Network[], accounts: IAccount[], assets: Asset[]) => {
  return mapAsync(networks, async (network) => {
    const addresses = accounts.filter((a) => a.networkId === network.id).map((a) => a.address);
    if (addresses.length === 0) {
      return null;
    }
    const tokenBalances = await getTokenBalancesForAddresses(assets, network, addresses);
    const baseAssetBalances = await getBaseAssetBalancesForAddresses(addresses, network);
    return { network, tokenBalances, baseAssetBalances };
  });
};

interface FetchBalancesResult {
  network: Network;
  tokenBalances: BalanceMap<BalanceMap<BigNumber>>;
  baseAssetBalances: BalanceMap<BigNumber>;
}

export const formatBalances = (assets: Asset[], accounts: IAccount[]) => ({
  network,
  tokenBalances,
  baseAssetBalances
}: FetchBalancesResult) =>
  Object.entries(tokenBalances).reduce((acc, [address, assetBalances]) => {
    const positiveAssetBalances = Object.entries(assetBalances).filter(
      ([, value]) => !value.isZero()
    );

    const uuid = generateDeterministicAddressUUID(network.id, address);

    const existingAccount = accounts.find(
      (x) => x.networkId === network.id && isSameAddress(x.address, address as TAddress)
    );
    if (!existingAccount) return { ...acc };

    const newAssets: AssetBalanceObject[] = positiveAssetBalances.reduce(
      (tempAssets: AssetBalanceObject[], [contractAddress, balance]: [string, BigNumber]) => {
        const tempAsset = assets.find((x) =>
          isSameAddress(x.contractAddress as TAddress, contractAddress as TAddress)
        );
        return [
          ...tempAssets,
          ...(tempAsset
            ? [
                {
                  uuid: tempAsset.uuid,
                  balance: balance.toString(10),
                  mtime: Date.now()
                }
              ]
            : [])
        ];
      },
      []
    );

    // Update base asset balance too
    const baseAssetBalance = baseAssetBalances[address];
    if (baseAssetBalance) {
      newAssets.push({
        uuid: generateAssetUUID(network.chainId),
        balance: baseAssetBalance.toString(10),
        mtime: Date.now()
      });
    }

    const unionedAssets = unionWith(eqBy(prop('uuid')), newAssets, existingAccount.assets);
    return { ...acc, [uuid]: unionedAssets };
  }, {});

export const getBalances = async (networks: Network[], accounts: IAccount[], assets: Asset[]) => {
  const balances = await fetchBalances(networks, accounts, assets);
  const formatter = formatBalances(assets, accounts);
  const formatted = balances.filter((b) => b !== null).map(formatter);
  return mergeAll(formatted);
};

export function* scanTokensWorker({
  payload
}: PayloadAction<{ accounts?: IAccount[]; assets?: Asset[] } | undefined>) {
  const { accounts: requestedAccounts, assets: requestedAssets } = payload || {};

  yield put(startTokenScan());

  const networks = yield select(selectNetworks);
  const allAssets = yield select(getAssets);

  const accounts: IAccount[] = requestedAccounts ? requestedAccounts : yield select(getAccounts);
  const assets = requestedAssets ? [...allAssets, ...requestedAssets] : allAssets;

  try {
    const newAssets = yield call(getBalances, networks, accounts, assets);
    yield put(updateAccountAssets(newAssets));
    yield put(finishTokenScan());
  } catch (err) {
    console.error(err);
  }
}
