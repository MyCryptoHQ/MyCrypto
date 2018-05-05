import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';
import { isValidAddressLabel } from 'libs/validators';
import {
  TypeKeys,
  ChangeAddressLabelEntry,
  SaveAddressLabelEntry,
  addAddressLabel,
  setAddressLabelEntry,
  clearAddressLabelEntry
} from 'actions/addressBook';
import { getAddressLabels, getLabelAddresses, getAddressLabelEntry } from 'selectors/addressBook';
import { showNotification } from 'actions/notifications';

export const ERROR_DURATION: number = 4000;

export function* handleChangeAddressLabelEntry(action: ChangeAddressLabelEntry): SagaIterator {
  const { id, address, label } = action.payload;
  const addresses = yield select(getAddressLabels);
  const labels = yield select(getLabelAddresses);
  const { addressError, labelError } = isValidAddressLabel(address, label, addresses, labels);
  const updatedEntry = {
    id,
    address,
    addressError,
    label,
    labelError
  };

  return yield put(setAddressLabelEntry(updatedEntry));
}

export function* handleSaveAddressLabelEntry(action: SaveAddressLabelEntry): SagaIterator {
  const id = action.payload;
  const entry = yield select(getAddressLabelEntry, id);
  const addresses = yield select(getAddressLabels);
  const labels = yield select(getLabelAddresses);
  const flashError = (error: string) => put(showNotification('danger', error, ERROR_DURATION));
  const { addressError, labelError } = isValidAddressLabel(
    entry.address,
    entry.label,
    addresses,
    labels
  );

  if (addressError) {
    return yield flashError(addressError);
  }

  if (labelError) {
    return yield flashError(labelError);
  }

  yield put(
    addAddressLabel({
      address: entry.address,
      label: entry.label
    })
  );

  return yield put(clearAddressLabelEntry(id));
}

export default function* addressBookSaga(): SagaIterator {
  yield takeEvery(TypeKeys.CHANGE_ADDRESS_LABEL_ENTRY, handleChangeAddressLabelEntry);
  yield takeEvery(TypeKeys.SAVE_ADDRESS_LABEL_ENTRY, handleSaveAddressLabelEntry);
}
