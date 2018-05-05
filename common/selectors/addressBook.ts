import { AppState } from 'reducers';
import { getCurrentTo } from './transaction';

export function getAddressLabels(state: AppState) {
  return state.addressBook.addresses;
}

export function getLabelAddresses(state: AppState) {
  return state.addressBook.labels;
}

export function getAddressErrors(state: AppState) {
  return state.addressBook.addressErrors;
}

export function getLabelErrors(state: AppState) {
  return state.addressBook.labelErrors;
}

export function getAddressLabelPairs(state: AppState) {
  const addresses = getAddressLabels(state);
  const pairs = Object.keys(addresses).map(address => ({
    address,
    label: addresses[address]
  }));

  return pairs;
}

export function getCurrentToLabel(state: AppState) {
  const addresses = getAddressLabels(state);
  const currentTo = getCurrentTo(state);

  return addresses[currentTo.raw] || null;
}
