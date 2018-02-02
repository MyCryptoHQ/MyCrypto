import { select, takeEvery, put } from 'redux-saga/effects';
import { getCustomNodeConfigs, getCustomNetworkConfigs } from 'selectors/config';
import { removeCustomNetwork, TypeKeys } from 'actions/config';
import { SagaIterator } from 'redux-saga';
import { AppState } from 'reducers';

// If there are any orphaned custom networks, purge them
export function* cleanCustomNetworks(): SagaIterator {
  const customNodes: AppState['config']['nodes']['customNodes'] = yield select(
    getCustomNodeConfigs
  );
  const customNetworks: AppState['config']['networks']['customNetworks'] = yield select(
    getCustomNetworkConfigs
  );

  Object.values(customNodes).forEach(function*(n) {
    if (!customNetworks[n.network]) {
      yield put(removeCustomNetwork({ id: n.network }));
    }
  });
}

export const network = [takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, cleanCustomNetworks)];
