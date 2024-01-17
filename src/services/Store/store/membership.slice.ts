import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fromUnixTime, isAfter, max } from 'date-fns';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { POLYGON_NETWORK, XDAI_NETWORK } from '@config';
import {
  MEMBERSHIP_CONFIG,
  MembershipState,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { MembershipApi } from '@services/ApiService';
import { MembershipFetchResult } from '@services/ApiService/MembershipApi';
import { IAccount, Network, NetworkId, StoreAccount, TAddress } from '@types';
import { flatten, isEmpty } from '@vendor';

import { isAccountInNetwork, isEthereumAccount } from '../Account/helpers';
import { getAccounts } from './account.slice';
import { selectDefaultNetwork, selectNetwork } from './network.slice';
import { AppState } from './root.reducer';

export type MembershipErrorState = {
  [key in 'Ethereum' | 'MATIC' | 'xDAI']: boolean;
};

export const initialState = {
  record: [] as MembershipStatus[],
  error: {} as MembershipErrorState
};

const slice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    setMembershipFetchState(
      state,
      action: PayloadAction<{ memberships: MembershipStatus[]; errors: MembershipErrorState }>
    ) {
      const addresses = new Set(action.payload.memberships.map((item) => item.address));
      state.record = [
        ...action.payload.memberships,
        ...state.record.filter((item) => !addresses.has(item.address))
      ];
      state.error = action.payload.errors;
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

export const getMembershipFetchError = (s: AppState) => s.memberships.error;
export const getMembershipState = createSelector(
  [getMemberships, getMembershipFetchError, getMembershipExpirations],
  (memberships, error, expirations) => {
    if (!memberships || (Object.values(memberships).length === 0 && !isEmpty(error))) {
      return MembershipState.ERROR;
    } else if (Object.values(memberships).length === 0 && isEmpty(error)) {
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
export const getIsMyCryptoMember = createSelector(
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
  const polygonNetwork: Network = yield select(selectNetwork(POLYGON_NETWORK));

  const membershipFetchConfig = [
    {
      accounts: (payload ?? membershipNetworkAccounts)
        .filter(isEthereumAccount)
        .map((a) => a.address),
      network: ethereumNetwork
    },
    {
      accounts: (payload ?? membershipNetworkAccounts)
        .filter((a) => isAccountInNetwork(a, XDAI_NETWORK))
        .map((a) => a.address),
      network: xdaiNetwork
    },
    {
      accounts: (payload ?? membershipNetworkAccounts)
        .filter((a) => isAccountInNetwork(a, POLYGON_NETWORK))
        .map((a) => a.address),
      network: polygonNetwork
    }
  ];
  const membershipState: MembershipFetchResult = yield call(
    MembershipApi.getMultiNetworkMemberships,
    membershipFetchConfig
  );
  yield put(
    slice.actions.setMembershipFetchState({
      memberships: membershipState.memberships,
      errors: membershipState.errors
    })
  );
}

export const { setMembershipFetchState, setMembership, deleteMembership } = slice.actions;

export default slice;
