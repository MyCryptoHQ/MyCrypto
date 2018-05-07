import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';
import { isValidAddressLabel } from 'libs/validators';
import {
  TypeKeys,
  ChangeAddressLabelEntry,
  SaveAddressLabelEntry,
  setAddressLabelEntry
} from 'actions/addressBook';
import {
  getAddressLabels,
  getLabelAddresses,
  getAddressLabelEntries,
  getAddressLabelEntry
} from 'selectors/addressBook';
import { showNotification } from 'actions/notifications';

export const ERROR_DURATION: number = 4000;

export function* handleChangeAddressLabelEntry(action: ChangeAddressLabelEntry): SagaIterator {
  const { id, address: temporaryAddress, label: temporaryLabel } = action.payload;
  const addresses = yield select(getAddressLabels);
  const labels = yield select(getLabelAddresses);
  const priorEntry = yield select(getAddressLabelEntry, id);
  const { addressError, labelError } = isValidAddressLabel(
    temporaryAddress,
    temporaryLabel,
    addresses,
    labels
  );
  const updatedEntry = {
    id,
    address: addressError ? priorEntry.address || '' : temporaryAddress,
    temporaryAddress,
    addressError,
    label: labelError ? priorEntry.label || '' : temporaryLabel,
    temporaryLabel,
    labelError
  };

  return yield put(setAddressLabelEntry(updatedEntry));
}

export function* handleSaveAddressLabelEntry(action: SaveAddressLabelEntry): SagaIterator {
  const id = action.payload;
  const entries = yield select(getAddressLabelEntries);
  const { address, addressError, label, labelError } = yield select(getAddressLabelEntry, id);
  const flashError = (error: string) => put(showNotification('danger', error, ERROR_DURATION));

  if (addressError) {
    return yield flashError(addressError);
  }

  if (labelError) {
    return yield flashError(labelError);
  }

  if (id === 'ADDRESS_BOOK_TABLE_ID') {
    // When entering a new label, create a new entry.
    const currentEntryCount = Object.keys(entries).length - 1; // Subtract temporary entries.

    yield put(
      setAddressLabelEntry({
        id: (currentEntryCount + 1).toString(),
        address: address,
        temporaryAddress: address,
        addressError: undefined,
        label,
        temporaryLabel: label,
        labelError: undefined
      })
    );
    yield put(
      setAddressLabelEntry({
        id: 'ADDRESS_BOOK_TABLE_ID',
        address: '',
        temporaryAddress: '',
        addressError: undefined,
        label: '',
        temporaryLabel: '',
        labelError: undefined
      })
    );
  } else {
    // When editing a label, overwrite the previous entry.
    yield put(
      setAddressLabelEntry({
        id: '0',
        address: address,
        temporaryAddress: address,
        addressError: undefined,
        label,
        temporaryLabel: label,
        labelError: undefined
      })
    );
  }
}

export default function* addressBookSaga(): SagaIterator {
  yield takeEvery(TypeKeys.CHANGE_ADDRESS_LABEL_ENTRY, handleChangeAddressLabelEntry);
  yield takeEvery(TypeKeys.SAVE_ADDRESS_LABEL_ENTRY, handleSaveAddressLabelEntry);
}
