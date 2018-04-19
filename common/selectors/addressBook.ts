import { AppState } from 'reducers';
import { getCurrentTo } from './transaction';

export function getLabels(state: AppState, options = {}) {
  const { addressBook: { labels } } = state;
  const finalLabels = options.reversed
    ? // Label: Address
      Object.keys(labels).reduce((prev, next) => {
        prev[labels[next]] = next;

        return prev;
      }, {})
    : // Address: Label
      labels;

  return finalLabels;
}

export function getAddressToLabels(state: AppState) {
  const { addressBook: { labels } } = state;

  const collection = Object.keys(labels).map(address => ({
    label: labels[address],
    address
  }));

  return collection;
}

export function getCurrentLabel(state: AppState) {
  const labels = getLabels(state);
  const currentTo = getCurrentTo(state);

  return labels[currentTo.raw] || null;
}
