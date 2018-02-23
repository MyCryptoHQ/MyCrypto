// Deterministic Wallet Path test strings
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

// m / purpose' / coin_type' / account' / change / address_index
const length5 = [
  "m/44'/0'/0'/0/0",
  "m/44'/0'/0'/0/1",
  "m/44'/0'/0'/1/0",
  "m/44'/0'/0'/1/1",
  "m/44'/0'/1'/0/0",
  "m/44'/0'/1'/0/1",
  "m/44'/0'/1'/1/0",
  "m/44'/0'/1'/1/1",
  "m/44'/1'/0'/0/0",
  "m/44'/1'/0'/0/1",
  "m/44'/1'/0'/1/0",
  "m/44'/1'/0'/1/1",
  "m/44'/1'/1'/0/0",
  "m/44'/1'/1'/0/1",
  "m/44'/1'/1'/1/0",
  "m/44'/1'/1'/1/1"
];

const wsLength5 = [
  "m / 44' / 0' / 0' / 0 / 0",
  "m / 44' / 0' / 0' / 0 / 1",
  "m / 44' / 0' / 0' / 1 / 0",
  "m / 44' / 0' / 0' / 1 / 1",
  "m / 44' / 0' / 1' / 0 / 0",
  "m / 44' / 0' / 1' / 0 / 1",
  "m / 44' / 0' / 1' / 1 / 0",
  "m / 44' / 0' / 1' / 1 / 1",
  "m / 44' / 1' / 0' / 0 / 0",
  "m / 44' / 1' / 0' / 0 / 1",
  "m / 44' / 1' / 0' / 1 / 0",
  "m / 44' / 1' / 0' / 1 / 1",
  "m / 44' / 1' / 1' / 0 / 0",
  "m / 44' / 1' / 1' / 0 / 1",
  "m / 44' / 1' / 1' / 1 / 0",
  "m / 44' / 1' / 1' / 1 / 1"
];

// m / purpose' / coin_type' / account' / change
const length4 = [
  "m/44'/0'/0'/0",
  "m/44'/0'/0'/1",
  "m/44'/0'/1'/0",
  "m/44'/0'/1'/1",
  "m/44'/1'/0'/0",
  "m/44'/1'/0'/1",
  "m/44'/1'/1'/0",
  "m/44'/1'/1'/1"
];

const wsLength4 = [
  "m / 44' / 0' / 0' / 0",
  "m / 44' / 0' / 0' / 1",
  "m / 44' / 0' / 1' / 0",
  "m / 44' / 0' / 1' / 1",
  "m / 44' / 1' / 0' / 0",
  "m / 44' / 1' / 0' / 1",
  "m / 44' / 1' / 1' / 0",
  "m / 44' / 1' / 1' / 1"
];

// m / purpose' / coin_type' / account'
const length3 = ["m/44'/0'/0'", "m/44'/0'/1'", "m/44'/1'/0'", "m/44'/1'/1'"];

const wsLength3 = [
  "m / 44' / 0' / 0'",
  "m / 44' / 0' / 1'",
  "m / 44' / 1' / 0'",
  "m / 44' / 1' / 1'"
];

// 'coin_type' accepts an index (0 - infinity)
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// m / purpose' / coin_type' / account' / change
const validCoinType = ["m/44'/3'/0'/0", "m/44'/60'/0'/0", "m/44'/37310'/0'/0"];
const invalidCoinType = ["m/44'/-1'/0'/0", "m/44'/3.2'/0'/0", "m/44'/twenty'/0'/0"];

// 'account' accepts an index (0 - infinity)
// m / purpose' / coin_type' / account' / change
const validAccount = ["m/44'/0'/3'/0", "m/44'/0'/30'/0", "m/44'/0'/97878'/0"];
const invalidAccount = ["m/44'/0'/-1'/0", "m/44'/0'/a'/0", "m/44'/0'/9.3'/0"];

// 'change' accepts a boolean (0 - 1)
// m / purpose' / coin_type' / account' / change
const validChange = ["m/44'/0'/0'/1", "m/44'/0'/0'/0"];
const inValidChange = ["m/44'/0'/0'/3", "m/44'/0'/0'/-1", "m/44'/0'/0'/0.5", "m/44'/0'/0'/a"];

const validPaths = [...validCoinType, ...validAccount, ...validChange];
const inValidPaths = [
  ...length5,
  ...wsLength5,
  ...invalidCoinType,
  ...invalidAccount,
  ...inValidChange
];

export const valid = [...length4, ...length3, ...validPaths];
export const invalid = [...wsLength4, ...wsLength3, ...inValidPaths];

// whitespace strings are evaluated the same way as nospace strings, except they allow optional spaces between each portion of the string
// ie. "m / 44' / 0' / 0'" is valid, "m / 4 4' / 0' / 0'" is invalid
export const whitespaceValid = [...wsLength4, ...wsLength3, ...valid];
export const whitespaceInvalid = [...invalid];
