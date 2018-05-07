import { AppState } from 'reducers';
import { ADDRESS_BOOK_TABLE_ID } from 'components/AddressBookTable';
import { getCurrentTo } from './transaction';

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
  return getAddressLabelEntry(state, ADDRESS_BOOK_TABLE_ID);
}

export function getAddressLabelRows(state: AppState) {
  const nonRowEntries = [ADDRESS_BOOK_TABLE_ID, 'ACCOUNT_ADDRESS_ID'];
  const entries = getAddressLabelEntries(state);
  const rows = Object.keys(entries)
    .map(entry => ({ ...entries[entry] }))
    .filter(entry => !nonRowEntries.includes(entry.id))
    .sort((a, b) => +a.id - +b.id);

  return rows;
}

export function getCurrentToLabel(state: AppState) {
  const addresses = getAddressLabels(state);
  const currentTo = getCurrentTo(state);

  return addresses[currentTo.raw] || null;
}
