export function getAddressToLabels(state) {
  const { addressBook: { labels } } = state;

  const collection = Object.keys(labels).map(address => ({
    label: labels[address],
    address
  }));

  return collection;
}
