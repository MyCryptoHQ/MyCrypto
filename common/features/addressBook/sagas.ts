import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';

import { isValidAddressLabel } from 'libs/validators';
import * as configSelectors from 'features/config/selectors';
import { notificationsActions } from 'features/notifications';
import * as constants from './constants';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export const ERROR_DURATION: number = 4000;

export function* handleChangeAddressLabelEntry(
  action: types.ChangeAddressLabelEntry
): SagaIterator {
  const {
    id,
    address: temporaryAddress,
    label: temporaryLabel,
    isEditing,
    overrideValidation
  } = action.payload;
  const addresses: ReturnType<typeof selectors.getAddressLabels> = yield select(
    selectors.getAddressLabels
  );
  const labels: ReturnType<typeof selectors.getLabelAddresses> = yield select(
    selectors.getLabelAddresses
  );
  const priorEntry: ReturnType<typeof selectors.getAddressLabelEntry> = yield select(
    selectors.getAddressLabelEntry,
    id
  );
  const chainId: ReturnType<typeof configSelectors.getNetworkChainId> = yield select(
    configSelectors.getNetworkChainId
  );
  const { addressError, labelError } = isValidAddressLabel(
    temporaryAddress,
    temporaryLabel,
    addresses,
    labels,
    chainId
  );
  const updatedEntry = {
    id,
    address: addressError && !isEditing ? priorEntry.address || '' : temporaryAddress,
    temporaryAddress,
    addressError: isEditing || overrideValidation ? undefined : addressError,
    label: labelError ? priorEntry.label || '' : temporaryLabel,
    temporaryLabel,
    labelError: overrideValidation ? undefined : labelError
  };

  return yield put(actions.setAddressLabelEntry(updatedEntry));
}

export function* handleSaveAddressLabelEntry(action: types.SaveAddressLabelEntry): SagaIterator {
  const id = action.payload;
  const {
    address,
    addressError,
    label,
    labelError
  }: ReturnType<typeof selectors.getAddressLabelEntry> = yield select(
    selectors.getAddressLabelEntry,
    id
  );
  const nextId: ReturnType<typeof selectors.getNextAddressLabelId> = yield select(
    selectors.getNextAddressLabelId
  );
  const flashError = (error: string) =>
    put(notificationsActions.showNotification('danger', error, ERROR_DURATION));

  if (addressError) {
    return yield flashError(addressError);
  }

  if (labelError) {
    return yield flashError(labelError);
  }

  yield put(actions.clearAddressLabel(address));
  yield put(
    actions.setAddressLabel({
      address,
      label
    })
  );

  if (id === constants.ADDRESS_BOOK_TABLE_ID) {
    // When entering a new label, create a new entry.
    yield put(
      actions.setAddressLabelEntry({
        id: nextId,
        address,
        temporaryAddress: address,
        addressError: undefined,
        label,
        temporaryLabel: label,
        labelError: undefined
      })
    );
    yield put(
      actions.setAddressLabelEntry({
        id: constants.ADDRESS_BOOK_TABLE_ID,
        address: '',
        temporaryAddress: '',
        addressError: undefined,
        label: '',
        temporaryLabel: '',
        labelError: undefined
      })
    );
  } else if (id === constants.ACCOUNT_ADDRESS_ID) {
    const ownEntry: ReturnType<typeof selectors.getAddressLabelEntryFromAddress> = yield select(
      selectors.getAddressLabelEntryFromAddress,
      address
    );

    yield put(
      actions.setAddressLabelEntry({
        id: ownEntry ? ownEntry.id : nextId,
        address,
        temporaryAddress: address,
        addressError: undefined,
        label,
        temporaryLabel: label,
        labelError: undefined
      })
    );
    yield put(
      actions.setAddressLabelEntry({
        id: constants.ACCOUNT_ADDRESS_ID,
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
      actions.setAddressLabelEntry({
        id,
        address,
        temporaryAddress: address,
        addressError: undefined,
        label,
        temporaryLabel: label,
        labelError: undefined
      })
    );
  }
}

export function* handleRemoveAddressLabelEntry(
  action: types.RemoveAddressLabelEntry
): SagaIterator {
  const id = action.payload;
  const { id: entryId, address }: ReturnType<typeof selectors.getAddressLabelEntry> = yield select(
    selectors.getAddressLabelEntry,
    id
  );

  if (typeof entryId === 'undefined') {
    return;
  }

  yield put(actions.clearAddressLabel(address));
  yield put(actions.clearAddressLabelEntry(id));

  if (id === constants.ACCOUNT_ADDRESS_ID) {
    const ownEntry: ReturnType<typeof selectors.getAddressLabelEntryFromAddress> = yield select(
      selectors.getAddressLabelEntryFromAddress,
      address
    );

    if (ownEntry) {
      yield put(actions.clearAddressLabelEntry(ownEntry.id));
    }
  }
}

export function* addressBookSaga(): SagaIterator {
  yield takeEvery(types.AddressBookActions.CHANGE_LABEL_ENTRY, handleChangeAddressLabelEntry);
  yield takeEvery(types.AddressBookActions.SAVE_LABEL_ENTRY, handleSaveAddressLabelEntry);
  yield takeEvery(types.AddressBookActions.REMOVE_LABEL_ENTRY, handleRemoveAddressLabelEntry);
}
