import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';
import { isValidAddressLabel } from 'libs/validators';
import {
  TypeKeys,
  AddAddressLabelRequested,
  addAddressLabelSucceeded,
  addAddressLabelFailed
} from 'actions/addressBook';
import { getAddressLabels, getLabelAddresses } from 'selectors/addressBook';
import { showNotification } from 'actions/notifications';

export const ERROR_DURATION: number = 4000;

export function* handleAddAddressLabelRequest(action: AddAddressLabelRequested): SagaIterator {
  const { index, address, label } = action.payload;
  const addresses = yield select(getAddressLabels);
  const labels = yield select(getLabelAddresses);
  const flashError = (error: string) => put(showNotification('danger', error, ERROR_DURATION));
  const { isValid, addressError, labelError } = isValidAddressLabel(
    address,
    label,
    addresses,
    labels
  );

  if (addressError) {
    yield flashError(addressError);
  }

  if (labelError) {
    yield flashError(labelError);
  }

  return isValid
    ? yield put(addAddressLabelSucceeded(action.payload))
    : yield put(
        addAddressLabelFailed({
          index,
          addressError,
          labelError
        })
      );
}

export default function* addressBookSaga(): SagaIterator {
  yield takeEvery(TypeKeys.ADD_ADDRESS_LABEL_REQUESTED, handleAddAddressLabelRequest);
}
