// @flow
import Big from 'big.js';

export function toFixedIfLarger(number: number, fixedSize: number = 6): string {
  return parseFloat(number.toFixed(fixedSize)).toString();
}

export function combineAndUpper(...args: string[]) {
  return args.reduce((acc, item) => acc.concat(item.toUpperCase()), '');
}

// Use in place of angular number filter
export function formatNumber(number: Big, digits: number = 3): string {
  let parts = number.toFixed(digits).split('.');

  // Remove trailing zeroes on decimal (If there is a decimal)
  if (parts[1]) {
    parts[1] = parts[1].replace(/0+$/, '');

    // If there's nothing left, remove decimal altogether
    if (!parts[1]) {
      parts.pop();
    }
  }

  // Commafy the whole numbers
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}
