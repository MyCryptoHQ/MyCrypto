import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { MembershipStatus } from '@features/PurchaseMembership/config';
import { MembershipApi } from '@services/ApiService';
import { IAccount, Network, StoreAccount, TAddress } from '@types';

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

export const fetchMemberships = createAction<IAccount[] | undefined>(
  `${slice.name}/fetchMemberships`
);

/**
 * Sagas
 */
export function* fetchMembershipsSaga() {
  yield takeLatest(fetchMemberships.type, fetchMembershipsWorker);
}

export function* fetchMembershipsWorker({ payload }: PayloadAction<IAccount[] | undefined>) {
  const accounts: StoreAccount[] = yield select(getWalletAccountsOnDefaultNetwork);
  const network: Network = yield select(getDefaultNetwork);

  const relevantAccounts = (payload ?? accounts).map((a) => a.address);

  try {
    const memberships = yield call(MembershipApi.getMemberships, relevantAccounts, network);
    yield put(slice.actions.setMemberships(memberships));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setMemberships, setMembership, deleteMembership, fetchError } = slice.actions;

export default slice;
