import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  MEMBERSHIP_CONTRACTS,
  MEMBERSHIP_CONTRACTS_ADDRESSES,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { ProviderHandler } from '@services/EthService/network/providerHandler';
import { Network, StoreAccount, TAddress } from '@types';
import { map, pipe } from '@vendor';

import { convertBNToBigNumberJS } from '../BalanceService';
import { getWalletAccountsOnDefaultNetwork } from './account.slice';
import { getDefaultNetwork } from './network.slice';

export const initialState = {
  record: [] as MembershipStatus[],
  error: false
};

const slice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
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

export const fetchMemberships = createAction<StoreAccount[] | undefined>(
  `${slice.name}/fetchMemberships`
);

/**
 * Sagas
 */
export function* fetchMembershipsSaga() {
  yield takeLatest(fetchMemberships.type, fetchMembershipsWorker);
}

export function* fetchMembershipsWorker({ payload }: PayloadAction<StoreAccount[] | undefined>) {
  const accounts: StoreAccount[] = yield select(getWalletAccountsOnDefaultNetwork);
  const network: Network = yield select(getDefaultNetwork);

  const relevantAccounts = (payload ?? accounts).map((a) => a.address);
  const provider = new ProviderHandler(network);

  try {
    const timestamps = yield call(getUnlockTimestamps, provider, relevantAccounts, {
      contracts: MEMBERSHIP_CONTRACTS_ADDRESSES
    });
    const newMemberships = format(timestamps);
    yield put(slice.actions.setMemberships(newMemberships));
  } catch {
    yield put(slice.actions.fetchError());
  }
}

export const { setMemberships, setMembership, deleteMembership, fetchError } = slice.actions;

export default slice;

/**
 * Helpers
 */
export const format = (timestamps) => {
  const res = pipe(map(map(convertBNToBigNumberJS)));
  const expiries = res(timestamps);

  return Object.keys(expiries)
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
};
