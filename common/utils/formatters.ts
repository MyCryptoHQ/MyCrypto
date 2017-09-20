import Big, { BigNumber } from 'bignumber.js';

export function toFixedIfLarger(num: number, fixedSize: number = 6): string {
  return parseFloat(num.toFixed(fixedSize)).toString();
}

export function combineAndUpper(...args: string[]) {
  return args.reduce((acc, item) => acc.concat(item.toUpperCase()), '');
}

// Use in place of angular number filter
export function formatNumber(num: BigNumber, digits: number = 3): string {
  const parts = num.toFixed(digits).split('.');

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

// TODO: Comment up this function to make it clear what's happening here.
export function formatGasLimit(
  limit: BigNumber,
  transactionUnit: string = 'ether'
) {
  let limitStr = limit.toString();

  // I'm guessing this is some known off-by-one-error from the node?
  // 21k is only the limit for ethereum though, so make sure they're
  // sending ether if we're going to fix it for them.
  if (limitStr === '21001' && transactionUnit === 'ether') {
    limitStr = '21000';
  }

  // If they've exceeded the gas limit per block, make it -1
  // TODO: Explain why not cap at limit?
  // TODO: Make this dynamic, potentially. Would require promisifying this fn.
  // TODO: Figure out if this is only true for ether. Do other currencies have
  //       this limit?
  if (limit.gte(4000000)) {
    limitStr = '-1';
  }

  return limitStr;
}
