import { AnyAction, createAction, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';

import hdWalletSlice from '@features/AddAccount/components/hdWallet.slice';
import { signMessageSlice } from '@features/SignAndVerifyMessage';
import { featureFlagSlice } from '@services/FeatureFlag';
import { deMarshallState, marshallState } from '@services/Store/DataManager/utils';
import { LocalStorage } from '@types';

import accountUndoSlice from './accountUndo.slice';
import claimSlice from './claims.slice';
import ensSlice from './ens.slice';
import importSlice from './import.slice';
import { initialLegacyState } from './legacy.initialState';
import membershipSlice from './membership.slice';
import nftSlice from './nft.slice';
import { APP_PERSIST_CONFIG, createPersistReducer, migrate } from './persist.config';
import persistenceSlice from './persistence.slice';
import { getAppState } from './selectors';
import tokenScanningSlice from './tokenScanning.slice';
import txHistorySlice from './txHistory.slice';

const reducers = combineReducers({
  [importSlice.name]: importSlice.reducer,
  [membershipSlice.name]: membershipSlice.reducer,
  [tokenScanningSlice.name]: tokenScanningSlice.reducer,
  [hdWalletSlice.name]: hdWalletSlice.reducer,
  [persistenceSlice.name as 'database']: createPersistReducer(persistenceSlice.reducer),
  [featureFlagSlice.name]: featureFlagSlice.reducer,
  [signMessageSlice.name]: signMessageSlice.reducer,
  [txHistorySlice.name]: txHistorySlice.reducer,
  [ensSlice.name]: ensSlice.reducer,
  [claimSlice.name]: claimSlice.reducer,
  [accountUndoSlice.name]: accountUndoSlice.reducer,
  [nftSlice.name]: nftSlice.reducer
});

/**
 * Actions
 */
export const appReset = createAction('app/Reset', (newDb = initialLegacyState) => ({
  payload: newDb
}));

const rootReducer = (state = reducers(undefined, { type: '' }), action: AnyAction) => {
  switch (action.type) {
    case appReset.type: {
      return {
        ...state,
        [persistenceSlice.name]: { ...action.payload, _persist: state.database._persist }
      };
    }
    default: {
      return reducers(state, action);
    }
  }
};

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

/**
 * AppState
 */
export const exportState = createSelector(getAppState, deMarshallState);
export const importState = createAction<string>('app/import');

export function* importSaga() {
  yield takeLatest(importState.type, importWorker);
}

function* importWorker({ payload }: PayloadAction<string>) {
  yield put(importSlice.actions.request());
  try {
    const settings = JSON.parse(payload);

    const migrated: LocalStorage = yield call(
      // @ts-expect-error: bad type choice on call effect
      migrate,
      marshallState(settings),
      APP_PERSIST_CONFIG.version!
    );
    yield put(appReset(migrated));
    yield put(importSlice.actions.success());
  } catch (err) {
    yield put(importSlice.actions.error(err));
  }
}
