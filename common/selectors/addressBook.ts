export function getLabels(state, options) {
  const { addressBook: { labels } } = state;
  const finalLabels = options.reversed
    ? Object.keys(labels).reduce((prev, next) => {
        prev[labels[next]] = next;

        return prev;
      }, {})
    : labels;

  return finalLabels;
}

export function getAddressToLabels(state) {
  const { addressBook: { labels } } = state;

  const collection = Object.keys(labels).map(address => ({
    label: labels[address],
    address
  }));

  return collection;
}
