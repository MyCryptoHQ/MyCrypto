import { AppState } from 'reducers';
import { getCurrentTo } from './transaction';

interface GetLabelOptions {
  reversed?: boolean;
}

interface AddressToLabel {
  [address: string]: string;
}

interface ReversedAddressToLabel {
  [label: string]: string;
}

export function getLabels(state: AppState, options: GetLabelOptions = {}) {
  const { addressBook: { labels } } = state;
  const finalLabels: AddressToLabel | ReversedAddressToLabel = options.reversed
    ? // Label: Address
      Object.keys(labels).reduce((prev: ReversedAddressToLabel, next: string) => {
        prev[labels[next]] = next;

        return prev;
      }, {})
    : // Address: Label
      labels;

  return finalLabels;
}

export function getReversedLabels(state: AppState) {
  const { addressBook: { labels } } = state;
  const reversedLabels = Object.keys(labels).reduce(
    (prev: ReversedAddressToLabel, next: string) => {
      prev[labels[next]] = next;

      return prev;
    },
    {}
  );

  return reversedLabels;
}

export function getAddressLabelPairs(state: AppState) {
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
