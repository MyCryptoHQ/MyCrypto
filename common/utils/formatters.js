// @flow
import Big from 'big.js';

export function toFixedIfLarger(number: number, fixedSize: number = 6): string {
  return parseFloat(number.toFixed(fixedSize)).toString();
}

// Use in place of angular number filter
export function formatNumber(number: Big, digits: number = 3): string {
  let parts = number.toFixed(digits).split('.');
  parts[1] = parts[1].replace(/0+/, '');
  if (!parts[1]) {
    parts.pop();
  }
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}
