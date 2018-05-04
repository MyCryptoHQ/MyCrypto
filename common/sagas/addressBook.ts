import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';
import { translateRaw } from 'translations';
import { isValidETHAddress, isValidLabelLength, isLabelWithoutENS } from 'libs/validators';
import {
  TypeKeys,
  AddLabelForAddressAction,
  addLabelForAddress as addLabelForAddressAction
} from 'actions/addressBook';
import { showNotification } from 'actions/notifications';
import { getLabels, getReversedLabels } from 'selectors/addressBook';

export const ERROR_DURATION: number = 4000;

export function* addLabelForAddress(action: AddLabelForAddressAction): SagaIterator {
  const { address, label } = action.payload;
  const labels = yield select(getLabels);
  const reversedLabels = yield select(getReversedLabels);
  const addressAlreadyExists = !!labels[address];
  const labelAlreadyExists = !!reversedLabels[label];

  if (!isValidETHAddress(address)) {
    return yield put(showNotification('danger', translateRaw('INVALID_ADDRESS'), ERROR_DURATION));
  }

  if (addressAlreadyExists) {
    return yield put(
      showNotification('danger', translateRaw('ADDRESS_ALREADY_EXISTS'), ERROR_DURATION)
    );
  }

  if (!isValidLabelLength(label)) {
    return yield put(
      showNotification('danger', translateRaw('INVALID_LABEL_LENGTH'), ERROR_DURATION)
    );
  }

  if (!isLabelWithoutENS(label)) {
    return yield put(
      showNotification('danger', translateRaw('LABEL_CANNOT_CONTAIN_ENS_SUFFIX'), ERROR_DURATION)
    );
  }

  if (labelAlreadyExists) {
    return yield put(
      showNotification('danger', translateRaw('LABEL_ALREADY_EXISTS'), ERROR_DURATION)
    );
  }

  return yield put(addLabelForAddressAction(action.payload));
}

export default function* addressBookSaga(): SagaIterator {
  yield takeEvery(TypeKeys.ADD_LABEL_FOR_ADDRESS, addLabelForAddress);
}
