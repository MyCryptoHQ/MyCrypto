import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import {
  MEMBERSHIP_CONFIG,
  MEMBERSHIP_CONTRACTS,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { ProviderHandler } from '@services/EthService';
import { StoreAccount, TAddress, WalletId } from '@types';

import { nestedToBigNumberJS } from '../BalanceService';

export const initialState = {
  record: [] as MembershipStatus[],
  error: false
};

const slice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    fetchMemberships() {},
    setMemberships(state, action: PayloadAction<MembershipStatus[]>) {
      const addresses = new Set(action.payload.map((item) => item.address));
      state.record = [
        ...action.payload,
        ...state.record.filter((item) => !addresses.has(item.address))
      ];
    },
    setMembership(state, action: PayloadAction<MembershipStatus>) {
      state.record.push(action.payload);
    },
    deleteMembership(state, action: PayloadAction<TAddress>) {
      const idx = state.record.findIndex((item) => item.address === action.payload);
      state.record.splice(idx, 1);
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export function* rootSaga() {
  yield all([takeLatest(slice.actions.fetchMemberships.name, fetchMembershipsSaga)]);
}

export function* fetchMembershipsSaga({ payload }: PayloadAction<StoreAccount[]>) {
  const accounts: StoreAccount[] = yield select((state: AppState) => state.legacy.accounts);
  const relevantAccounts = (payload ?? accounts)
    .filter((account) => account.networkId === DEFAULT_NETWORK)
    .filter((account) => account.wallet !== WalletId.VIEW_ONLY);

  const networks: Network[] = yield select((state: AppState) => state.legacy.networks);
  const network = networks.find(({ id }) => DEFAULT_NETWORK === id);
  if (!network || relevantAccounts.length === 0) return;

  const provider = new ProviderHandler(network);

  try {
    const timestamps = yield call(
      getUnlockTimestamps,
      provider,
      relevantAccounts.map((account) => account.address),
      {
        contracts: Object.values(MEMBERSHIP_CONFIG).map((membership) => membership.contractAddress)
      }
    );
    const expiries = nestedToBigNumberJS(timestamps);

    const newMemberships = Object.keys(expiries)
      .map((address: TAddress) => ({
        address,
        memberships: Object.keys(expiries[address])
          .filter((contract) => expiries[address][contract].isGreaterThan(new BigNumber(0)))
          .map((contract) => ({
            type: MEMBERSHIP_CONTRACTS[contract],
            expiry: expiries[address][contract]
          }))
      }))
      .filter((m) => m.memberships.length > 0);

    yield put(slice.actions.setMemberships(newMemberships));
  } catch {
    yield put(slice.actions.fetchError());
  }
}

export const { setMemberships, setMembership, deleteMembership, fetchError } = slice.actions;

export default slice;
