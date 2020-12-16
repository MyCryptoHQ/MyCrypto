import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fromUnixTime, isAfter, max } from 'date-fns';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { MembershipState, MembershipStatus } from '@features/PurchaseMembership/config';
import { MembershipApi } from '@services/ApiService';
import { IAccount, Network, StoreAccount, TAddress } from '@types';
import { flatten } from '@vendor';

import { getWalletAccountsOnDefaultNetwork } from './account.slice';
import { getDefaultNetwork } from './network.slice';
import { AppState } from './root.reducer';

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
 * Selectors
 */
export const getMemberships = (s: AppState) => s.memberships.record;
const getMembershipExpirations = createSelector(getMemberships, (memberships) =>
  flatten(Object.values(memberships).map((m) => Object.values(m.memberships).map((e) => e.expiry)))
);

export const getMembershipState = createSelector(
  [getMemberships, getMembershipExpirations],
  (memberships, expirations) => {
    if (!memberships) {
      return MembershipState.ERROR;
    } else if (Object.values(memberships).length === 0) {
      return MembershipState.NOTMEMBER;
    } else {
      if (
        expirations.some((expirationTime) =>
          isAfter(fromUnixTime(parseInt(expirationTime)), Date.now())
        )
      ) {
        return MembershipState.MEMBER;
      } else {
        return MembershipState.EXPIRED;
      }
    }
  }
);
export const isMyCryptoMember = createSelector(
  [getMembershipState],
  (status) => status === MembershipState.MEMBER
);
export const membershipExpiryDate = createSelector(getMembershipExpirations, (expirations) => {
  return max(expirations.map((e) => new Date(e)));
});
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
