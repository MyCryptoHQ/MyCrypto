import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { IAccount, TUuid } from '@types';
import { findIndex, isEmpty, propEq } from '@vendor';

import { createAccounts, destroyAccount } from './account.slice';
import { deleteMembership, fetchMemberships } from './membership.slice';
import { AppState } from './root.reducer';
import { addCurrent, getCurrents, resetCurrentsTo } from './settings.slice';

export const initialState = [] as IAccount[];

const slice = createSlice({
  name: 'accountUndo',
  initialState,
  reducers: {
    add(state, action: PayloadAction<IAccount>) {
      state.push(action.payload);
    },
    remove(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    }
  }
});

export const restoreAccount = createAction<TUuid>(`${slice.name}/restoreAccount`);
export const deleteAccount = createAction<IAccount>(`${slice.name}/deleteAccount`);

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.accountUndo,
  (s) => s
);
export const getAccountUndoCache = createSelector([getSlice], (s) =>
  s.reduce((acc, cur) => ({ ...acc, [cur.uuid]: cur }), {} as Record<string, IAccount>)
);
/**
 * Sagas
 */
export function* accountUndoSaga() {
  yield all([
    takeLatest(restoreAccount.type, restoreAccountWorker),
    takeLatest(deleteAccount.type, deleteAccountWorker)
  ]);
}

export function* restoreAccountWorker({ payload }: PayloadAction<TUuid>) {
  const cache: Record<string, IAccount> = yield select(getAccountUndoCache);

  const account = cache[payload];
  if (!isEmpty(account)) {
    yield put(createAccounts([account]));
    yield put(addCurrent(payload));
    yield put(fetchMemberships([account]));
    yield put(slice.actions.remove(payload));
  }
}

export function* deleteAccountWorker({ payload }: PayloadAction<IAccount>) {
  const dashboardAccounts: TUuid[] = yield select(getCurrents);
  yield put(slice.actions.add(payload));
  yield put(destroyAccount(payload.uuid));
  yield put(
    resetCurrentsTo(dashboardAccounts.filter((dashboardUUID) => dashboardUUID !== payload.uuid))
  );
  yield put(deleteMembership({ address: payload.address, networkId: payload.networkId }));
}

export default slice;
