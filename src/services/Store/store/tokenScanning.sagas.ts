import { BalanceMap } from '@mycrypto/eth-scan';
import { PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Asset, AssetBalanceObject, IAccount, Network, TAddress } from '@types';
import {
  generateAssetUUID,
  generateDeterministicAddressUUID,
  isSameAddress,
  mapAsync
} from '@utils';
import { eqBy, mergeAll, prop, unionWith } from '@vendor';

import { getBaseAssetBalancesForAddresses, getTokenBalancesForAddresses } from '../BalanceService';
import { getAccounts, updateAccountAssets } from './account.slice';
import { getAssets } from './asset.slice';
import { selectNetworks } from './network.slice';
import { fetchRates } from './rates.slice';
import { finishTokenScan, scanTokens, startTokenScan } from './tokenScanning.slice';

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
                  balance: balance.toString(10)
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
        balance: baseAssetBalance.toString(10)
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
  const { accounts: requestedAccounts, assets: requestedAssets } = payload ?? {};

  yield put(startTokenScan());

  const networks = yield select(selectNetworks);

  const accounts: IAccount[] = requestedAccounts ? requestedAccounts : yield select(getAccounts);
  const assets: Asset[] = requestedAssets ? requestedAssets : yield select(getAssets);

  try {
    const newAssets = yield call(getBalances, networks, accounts, assets);

    yield put(updateAccountAssets(newAssets));
    // Update rates as part of this
    yield call(fetchRates);
    yield put(finishTokenScan());
  } catch (err) {
    console.error(err);
  }
}
