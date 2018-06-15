import { toChecksumAddress } from 'ethereumjs-util';

import { AppState } from 'features/reducers';
import * as transactionSelectors from 'features/transaction/selectors';
import * as addressBookConstants from './constants';
import * as addressBookTypes from './types';

export function getAddressLabels(state: AppState) {
  return state.addressBook.addresses;
}

export function getLabelAddresses(state: AppState) {
  return state.addressBook.labels;
}

export function getAddressLabelEntry(state: AppState, id: string) {
  return state.addressBook.entries[id] || {};
}

export function getAddressLabelEntries(state: AppState) {
  return state.addressBook.entries;
}

export function getAddressBookTableEntry(state: AppState) {
  return getAddressLabelEntry(state, addressBookConstants.ADDRESS_BOOK_TABLE_ID);
}

export function getAccountAddressEntry(state: AppState) {
  return getAddressLabelEntry(state, addressBookConstants.ACCOUNT_ADDRESS_ID);
}

export function getAddressLabelEntryFromAddress(state: AppState, address: string) {
  const rows = getAddressLabelRows(state);
  const entry = rows.find(
    (iteratedEntry: addressBookTypes.AddressLabelEntry) =>
      iteratedEntry.address === toChecksumAddress(address)
  );

  return entry;
}

export function getAddressLabelRows(state: AppState) {
  const nonRowEntries = [addressBookConstants.ADDRESS_BOOK_TABLE_ID, 'ACCOUNT_ADDRESS_ID'];
  const entries = getAddressLabelEntries(state);
  const rows = Object.keys(entries)
    .map(entry => ({ ...entries[entry] }))
    .filter(entry => !nonRowEntries.includes(entry.id))
    .sort((a, b) => +a.id - +b.id);

  return rows;
}

export function getNextAddressLabelId(state: AppState) {
  const rows = getAddressLabelRows(state);

  if (rows.length === 0) {
    return '1';
  }

  return (+rows[rows.length - 1].id + 1).toString();
}

export function getCurrentToLabel(state: AppState) {
  const addresses = getAddressLabels(state);
  const currentTo = transactionSelectors.getCurrentTo(state);

  return addresses[currentTo.raw] || null;
}
