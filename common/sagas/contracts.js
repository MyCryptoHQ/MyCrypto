import { takeEvery, put } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import translate from 'translations';

import {
  AccessContractAction,
  setInteractiveContract
} from 'actions/contracts';
import { showNotification } from 'actions/notifications';
import { isValidETHAddress } from 'libs/validators';

function* handleAccessContract(action: AccessContractAction) {
  const contractFunctions = [];

  if (!action.address || !isValidETHAddress(action.address)) {
    yield put(showNotification('danger', translate('ERROR_5'), 5000));
    return;
  }

  try {
    const abi = JSON.parse(action.abiJson);
    if (abi.constructor !== Array) {
      throw new Error('ABI JSON was not an array!');
    }

    abi.forEach(instruction => {
      if (instruction.type === 'function') {
        contractFunctions.push(instruction);
      }
    });

    yield put(setInteractiveContract(contractFunctions));
  } catch (err) {
    console.error('Error parsing contract ABI JSON', err);
    yield put(showNotification('danger', translate('ERROR_26'), 5000));
  }
}

export default function* contractsSaga(): Generator<Effect, void, any> {
  yield takeEvery('ACCESS_CONTRACT', handleAccessContract);
}
