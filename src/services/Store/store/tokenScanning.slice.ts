import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Asset, AssetBalanceObject, Network, StoreAccount, TAddress } from '@types';
import { generateAssetUUID, generateDeterministicAddressUUID, isSameAddress } from '@utils';
import { mapAsync } from '@utils/asyncFilter';
import { eqBy, identity, mergeAll, prop, unionWith } from '@vendor';

import { getAllTokensBalancesOfAccounts, getBaseAssetBalances } from '../BalanceService';
import { getAccounts, updateAccountAssets } from './account.slice';
import { getAssets } from './asset.slice';
import { getNetworks } from './network.slice';
import { AppState } from './reducer';

export const initialState = {
  scanning: false
};

const slice = createSlice({
  name: 'tokenScanning',
  initialState,
  reducers: {
    scanTokens(
      state,
      _action: PayloadAction<{ accounts?: StoreAccount[]; assets?: Asset[] } | undefined>
    ) {
      state.scanning = true;
    },
    finishTokenScan(state) {
      state.scanning = false;
    }
  }
});

export const { scanTokens, finishTokenScan } = slice.actions;

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

export const getTokens = async (networks: Network[], accounts: StoreAccount[], assets: Asset[]) => {
  return mapAsync(networks, async (network) => {
    const addresses = accounts.filter((a) => a.networkId === network.id).map((a) => a.address);
    if (addresses.length === 0) {
      return {};
    }
    const balanceMap = await getAllTokensBalancesOfAccounts(network, addresses, assets);
    const baseAssetBalanceMap = await getBaseAssetBalances(addresses, network);
    return Object.entries(balanceMap).reduce((acc, [address, assetBalances]) => {
      const positiveAssetBalances = Object.entries(assetBalances).filter(
        ([, value]) => !value.isZero()
      );

      const uuid = generateDeterministicAddressUUID(network.id, address);

      const existingAccount = accounts.find((x) => x.uuid === uuid);
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
      const baseAssetBalance = baseAssetBalanceMap[address];
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
  }).then(mergeAll);
};

export function* scanTokensWorker({
  payload
}: PayloadAction<{ accounts?: StoreAccount[]; assets?: Asset[] } | undefined>) {
  const { accounts: requestedAccounts, assets: requestedAssets } = payload || {};

  const networks = yield select(getNetworks);
  const allAssets = yield select(getAssets);

  const accounts: StoreAccount[] = requestedAccounts
    ? requestedAccounts
    : yield select(getAccounts);
  const assets = requestedAssets ? [...allAssets, ...requestedAssets] : allAssets;

  try {
    const newAssets = yield call(getTokens, networks, accounts, assets);

    yield put(updateAccountAssets(newAssets));

    yield put(finishTokenScan());
  } catch (err) {
    console.error(err);
  }
}
