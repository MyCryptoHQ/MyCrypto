import { Wei } from 'libs/units';

export function toFixedIfLarger(num: number, fixedSize: number = 6): string {
  return parseFloat(num.toFixed(fixedSize)).toString();
}

export function combineAndUpper(...args: string[]) {
  return args.reduce((acc, item) => acc.concat(item.toUpperCase()), '');
}

const toFixed = (num: string, digits: number = 3) => {
  const [integerPart, fractionPart = ''] = num.split('.');
  if (fractionPart.length === digits) {
    return num;
  }
  if (fractionPart.length < digits) {
    return `${integerPart}.${fractionPart.padEnd(digits, '0')}`;
  }

  let decimalPoint = integerPart.length;

  const formattedFraction = fractionPart.slice(0, digits);

  const integerArr = `${integerPart}${formattedFraction}`.split('').map(str => +str);

  let carryOver = Math.floor((+fractionPart[digits] + 5) / 10);

  // grade school addition / rounding

  for (let i = integerArr.length - 1; i >= 0; i--) {
    const currVal = integerArr[i] + carryOver;
    const newVal = currVal % 10;
    carryOver = Math.floor(currVal / 10);
    integerArr[i] = newVal;
    if (i === 0 && carryOver > 0) {
      integerArr.unshift(0);
      decimalPoint++;
      i++;
    }
  }

  const strArr = integerArr.map(n => n.toString());

  strArr.splice(decimalPoint, 0, '.');

  if (strArr[strArr.length - 1] === '.') {
    strArr.pop();
  }

  return strArr.join('');
};

// Use in place of angular number filter
export function formatNumber(num: string, digits?: number): string {
  const parts = toFixed(num, digits).split('.');

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
export function formatGasLimit(limit: Wei, transactionUnit: string = 'ether') {
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
  if (limit.gten(4000000)) {
    limitStr = '-1';
  }

  return limitStr;
}

// Regex modified from this stackoverflow answer
// https://stackoverflow.com/a/10805198, with the comma character added as a
// delimiter (in the case of csv style mnemonic phrases) as well as any stray
// space characters. it should be fairly easy to add new delimiters as required
export function formatMnemonic(phrase: string) {
  return phrase.replace(/(\r\n|\n|\r|\s+|,)/gm, ' ').trim();
}
