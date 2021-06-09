import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fromUnixTime, isAfter, max } from 'date-fns';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { XDAI_NETWORK } from '@config';
import {
  MEMBERSHIP_CONFIG,
  MembershipState,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { MembershipApi } from '@services/ApiService';
import { IAccount, Network, NetworkId, StoreAccount, TAddress } from '@types';
import { flatten } from '@vendor';

import { isAccountInNetwork, isEthereumAccount } from '../Account/helpers';
import { getAccounts } from './account.slice';
import { selectDefaultNetwork, selectNetwork } from './network.slice';
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
    deleteMembership(state, action: PayloadAction<{ address: TAddress; networkId: NetworkId }>) {
      const idx = state.record.findIndex(
        (item) =>
          item.address === action.payload.address && item.networkId === action.payload.networkId
      );
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
          isAfter(fromUnixTime(parseInt(expirationTime, 10)), Date.now())
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
  return max(expirations.map((e) => fromUnixTime(parseInt(e, 10))));
});
/**
 * Sagas
 */
export function* fetchMembershipsSaga() {
  yield takeLatest(fetchMemberships.type, fetchMembershipsWorker);
}

export function* fetchMembershipsWorker({ payload }: PayloadAction<IAccount[] | undefined>) {
  const accounts: StoreAccount[] = yield select(getAccounts);
  const membershipNetworkIds = [
    ...new Set(Object.values(MEMBERSHIP_CONFIG).map(({ networkId }) => networkId))
  ];
  const membershipNetworkAccounts = accounts.filter(({ networkId }) =>
    membershipNetworkIds.includes(networkId)
  );
  const ethereumNetwork: Network = yield select(selectDefaultNetwork);
  const xdaiNetwork: Network = yield select(selectNetwork(XDAI_NETWORK));
  const xdaiAccounts = (payload || membershipNetworkAccounts).filter((a) =>
    isAccountInNetwork(a, XDAI_NETWORK)
  );

  const ethereumAccounts = (payload || membershipNetworkAccounts).filter(isEthereumAccount);

  try {
    const ethereumMemberships = yield call(
      MembershipApi.getMemberships,
      ethereumAccounts.map(({ address }) => address as TAddress),
      ethereumNetwork
    );
    const xdaiMemberships = yield call(
      MembershipApi.getMemberships,
      xdaiAccounts.map(({ address }) => address as TAddress),
      xdaiNetwork
    );
    yield put(slice.actions.setMemberships([...ethereumMemberships, ...xdaiMemberships]));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setMemberships, setMembership, deleteMembership, fetchError } = slice.actions;

export default slice;
