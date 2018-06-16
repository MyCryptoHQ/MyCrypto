import { SagaIterator } from 'redux-saga';
import { select, put, takeEvery } from 'redux-saga/effects';

import { isValidAddressLabel } from 'libs/validators';
import * as configSelectors from 'features/config/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as addressBookConstants from './constants';
import * as addressBookTypes from './types';
import * as addressBookActions from './actions';
import * as addressBookSelectors from './selectors';

export const ERROR_DURATION: number = 4000;

export function* handleChangeAddressLabelEntry(
  action: addressBookTypes.ChangeAddressLabelEntry
): SagaIterator {
  const {
    id,
    address: temporaryAddress,
    label: temporaryLabel,
    isEditing,
    overrideValidation
  } = action.payload;
  const addresses: ReturnType<typeof addressBookSelectors.getAddressLabels> = yield select(
    addressBookSelectors.getAddressLabels
  );
  const labels: ReturnType<typeof addressBookSelectors.getLabelAddresses> = yield select(
    addressBookSelectors.getLabelAddresses
  );
  const priorEntry: ReturnType<typeof addressBookSelectors.getAddressLabelEntry> = yield select(
    addressBookSelectors.getAddressLabelEntry,
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

  return yield put(addressBookActions.setAddressLabelEntry(updatedEntry));
}

export function* handleSaveAddressLabelEntry(
  action: addressBookTypes.SaveAddressLabelEntry
): SagaIterator {
  const id = action.payload;
  const {
    address,
    addressError,
    label,
    labelError
  }: ReturnType<typeof addressBookSelectors.getAddressLabelEntry> = yield select(
    addressBookSelectors.getAddressLabelEntry,
    id
  );
  const nextId: ReturnType<typeof addressBookSelectors.getNextAddressLabelId> = yield select(
    addressBookSelectors.getNextAddressLabelId
  );
  const flashError = (error: string) =>
    put(notificationsActions.showNotification('danger', error, ERROR_DURATION));

  if (addressError) {
    return yield flashError(addressError);
  }

  if (labelError) {
    return yield flashError(labelError);
  }

  yield put(addressBookActions.clearAddressLabel(address));
  yield put(
    addressBookActions.setAddressLabel({
      address,
      label
    })
  );

  if (id === addressBookConstants.ADDRESS_BOOK_TABLE_ID) {
    // When entering a new label, create a new entry.
    yield put(
      addressBookActions.setAddressLabelEntry({
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
      addressBookActions.setAddressLabelEntry({
        id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
        address: '',
        temporaryAddress: '',
        addressError: undefined,
        label: '',
        temporaryLabel: '',
        labelError: undefined
      })
    );
  } else if (id === addressBookConstants.ACCOUNT_ADDRESS_ID) {
    const ownEntry: ReturnType<
      typeof addressBookSelectors.getAddressLabelEntryFromAddress
    > = yield select(addressBookSelectors.getAddressLabelEntryFromAddress, address);

    yield put(
      addressBookActions.setAddressLabelEntry({
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
      addressBookActions.setAddressLabelEntry({
        id: addressBookConstants.ACCOUNT_ADDRESS_ID,
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
      addressBookActions.setAddressLabelEntry({
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
  action: addressBookTypes.RemoveAddressLabelEntry
): SagaIterator {
  const id = action.payload;
  const {
    id: entryId,
    address
  }: ReturnType<typeof addressBookSelectors.getAddressLabelEntry> = yield select(
    addressBookSelectors.getAddressLabelEntry,
    id
  );

  if (typeof entryId === 'undefined') {
    return;
  }

  yield put(addressBookActions.clearAddressLabel(address));
  yield put(addressBookActions.clearAddressLabelEntry(id));

  if (id === addressBookConstants.ACCOUNT_ADDRESS_ID) {
    const ownEntry: ReturnType<
      typeof addressBookSelectors.getAddressLabelEntryFromAddress
    > = yield select(addressBookSelectors.getAddressLabelEntryFromAddress, address);

    if (ownEntry) {
      yield put(addressBookActions.clearAddressLabelEntry(ownEntry.id));
    }
  }
}

export function* addressBookSaga(): SagaIterator {
  yield takeEvery(
    addressBookTypes.AddressBookActions.CHANGE_LABEL_ENTRY,
    handleChangeAddressLabelEntry
  );
  yield takeEvery(
    addressBookTypes.AddressBookActions.SAVE_LABEL_ENTRY,
    handleSaveAddressLabelEntry
  );
  yield takeEvery(
    addressBookTypes.AddressBookActions.REMOVE_LABEL_ENTRY,
    handleRemoveAddressLabelEntry
  );
}
