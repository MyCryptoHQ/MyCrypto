import { AppState } from 'reducers';
import { getCurrentTo } from './transaction';

export function getAddressLabels(state: AppState) {
  return state.addressBook.addresses;
}

export function getLabelAddresses(state: AppState) {
  return state.addressBook.labels;
}

export function getAddressLabelEntries(state: AppState) {
  return state.addressBook.entries;
}

export function getAddressLabelEntry(state: AppState, id: string) {
  return state.addressBook.entries[id] || {};
}

export function getCurrentToLabel(state: AppState) {
  const addresses = getAddressLabels(state);
  const currentTo = getCurrentTo(state);

  return addresses[currentTo.raw] || null;
}
