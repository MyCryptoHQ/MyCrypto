import {
  FETCH_NODE_CONTRACTS,
  setNodeContracts,
  ACCESS_CONTRACT,
  AccessContractAction,
  DEPLOY_CONTRACT,
  DeployContractAction
} from 'actions/contracts';
import { NODE_CHANGE } from 'actions/configConstants';
import CONTRACTS from 'config/contracts';
import { NODES } from 'config/data';
import { getNode } from 'selectors/config';

import { takeEvery, select, put } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';

function* handleFetchNodeContracts() {
  const nodeKey = yield select(getNode);
  const node = NODES[nodeKey] || {};
  const contracts = CONTRACTS[node.network] || [];
  yield put(setNodeContracts(contracts));
}

// function handleAccessContract(action: AccessContractAction) {
//   console.log(action);
// }

// function handleDeployContract(action: DeployContractAction) {
//   console.log(action);
// }

export default function* contractsSaga(): Generator<Effect, void, any> {
  // yield takeEvery(ACCESS_CONTRACT, handleAccessContract);
  // yield takeEvery(DEPLOY_CONTRACT, handleDeployContract);
  yield takeEvery(
    [FETCH_NODE_CONTRACTS, NODE_CHANGE],
    handleFetchNodeContracts
  );
}
