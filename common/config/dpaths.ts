export const ETH_DEFAULT: DPath = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0"
};

export const ETH_TREZOR: DPath = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0"
};

export const ETH_LEDGER: DPath = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'"
};

export const ETC_LEDGER: DPath = {
  label: 'Ledger (ETC)',
  value: "m/44'/60'/160720'/0"
};

export const ETC_TREZOR: DPath = {
  label: 'TREZOR (ETC)',
  value: "m/44'/61'/0'/0"
};

export const ETH_TESTNET: DPath = {
  label: 'Testnet (ETH)',
  value: "m/44'/1'/0'/0"
};

export const EXP_DEFAULT: DPath = {
  label: 'Default (EXP)',
  value: "m/44'/40'/0'/0"
};

export const UBQ_DEFAULT: DPath = {
  label: 'Default (UBQ)',
  value: "m/44'/108'/0'/0"
};

export const ETH_SINGULAR: DPath = {
  label: 'SingularDTV',
  value: "m/0'/0'/0'"
};

export const DPaths: DPath[] = [
  ETH_DEFAULT,
  ETH_TREZOR,
  ETH_LEDGER,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBQ_DEFAULT
];

// PATHS TO BE INCLUDED REGARDLESS OF WALLET FORMAT
export const EXTRA_PATHS = [ETH_SINGULAR];

// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3

// m / purpose' / coin_type' / account' / change / address_index
//   |          |            |          |        |
//   | constant |   index    |  index   | 0 or 1 |
//   |__________|____________|__________|________|

// whitespace strings are evaluated the same way as nospace strings, except they allow optional spaces between each portion of the string
// ie. "m / 44' / 0' / 0'" is valid, "m / 4 4' / 0' / 0'" is invalid
export const dPathRegex = /m\/(44|0)'\/[0-9]+\'\/[0-9]+(\'+$|\'+(\/[0-1]+$))/;
// export const whitespaceDPathRegex = /m\s*\/\s*44'\s*\/\s*[0-9]+\'\s*\/\s*[0-9]+(\'+$|\'+\s*(\/\s*[0-1]+$))/;
