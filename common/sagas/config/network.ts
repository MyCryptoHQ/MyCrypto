import { select, takeEvery, put } from 'redux-saga/effects';
import { getCustomNodeConfigs, getCustomNetworkConfigs } from 'selectors/config';
import { removeCustomNetwork, TypeKeys } from 'actions/config';
import { SagaIterator } from 'redux-saga';
import { AppState } from 'reducers';

// If there are any orphaned custom networks, prune them
export function* pruneCustomNetworks(): SagaIterator {
  const customNodes: AppState['config']['nodes']['customNodes'] = yield select(
    getCustomNodeConfigs
  );
  const customNetworks: AppState['config']['networks']['customNetworks'] = yield select(
    getCustomNetworkConfigs
  );

  //construct lookup table of networks

  const linkedNetworks = Object.values(customNodes).reduce(
    (networkMap, currentNode) => ({ ...networkMap, [currentNode.network]: true }),
    {}
  );

  for (const currNetwork of Object.keys(customNetworks)) {
    if (!linkedNetworks[currNetwork]) {
      yield put(removeCustomNetwork({ id: currNetwork }));
    }
  }
}

export const network = [takeEvery(TypeKeys.CONFIG_REMOVE_CUSTOM_NODE, pruneCustomNetworks)];
