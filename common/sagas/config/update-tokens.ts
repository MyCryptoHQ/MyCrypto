import { getNetworkConfig, getOffline } from 'selectors/config';
import { select, call, put, fork, takeEvery } from 'redux-saga/effects';
import { UnwrapEffects, ExtPromise } from 'shared/types/sagaHelpers';
import {
  updateTokensSucceeded,
  UpdateTokensRequested,
  updateTokensFailed,
  updateTokensRequested,
  TypeKeys
} from 'actions/config';
import { updateTokensForNetwork } from 'libs/ipfs-tokens';
import { delay } from 'redux-saga';

export function* handleUpdatingTokens({ payload: { id } }: UpdateTokensRequested) {
  const config: UnwrapEffects<typeof getNetworkConfig> = yield select(getNetworkConfig);
  if (config.isCustom) {
    return;
  }

  const appOffline: UnwrapEffects<typeof getOffline> = yield select(getOffline);
  if (appOffline) {
    return;
  }
  try {
    const { hash, tokens }: ExtPromise<UnwrapEffects<typeof updateTokensForNetwork>> = yield call(
      updateTokensForNetwork,
      config
    );
    yield put(updateTokensSucceeded({ id, tokens, hash }));
  } catch (e) {
    console.error((e as Error).message);
    yield put(updateTokensFailed({ id }));
  }
}

export function* fireTokenUpdate() {
  const config: UnwrapEffects<typeof getNetworkConfig> = yield select(getNetworkConfig);
  if (config.isCustom) {
    return;
  }
  // allow shepherdProvider async init to complete. TODO - don't export shepherdProvider as promise
  yield call(delay, 300);
  yield put(updateTokensRequested({ id: config.name }));
}

export const updateTokens = [
  takeEvery(TypeKeys.CONFIG_UPDATE_TOKENS_REQUESTED, handleUpdatingTokens),
  fork(fireTokenUpdate),
  takeEvery([TypeKeys.CONFIG_NODE_CHANGE], fireTokenUpdate)
];
