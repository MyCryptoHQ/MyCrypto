import {
  ACCESS_CONTRACT,
  ACCESS_CONTRACT_SUCCESS,
  ACCESS_CONTRACT_FAILURE,
  AccessContractAction,
  DEPLOY_CONTRACT,
  DEPLOY_CONTRACT_SUCCESS,
  DEPLOY_CONTRACT_FAILURE,
  DeployContractAction
} from 'actions/contracts';
import { takeEvery } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';

function handleAccessContract(action: AccessContractAction) {
  console.log(action);
}

function handleDeployContract(action: DeployContractAction) {
  console.log(action);
}

export default function contractsSaga(): Generator<Effect, void, any> {
  takeEvery(ACCESS_CONTRACT, handleAccessContract);
  takeEvery(DEPLOY_CONTRACT, handleDeployContract);
}
