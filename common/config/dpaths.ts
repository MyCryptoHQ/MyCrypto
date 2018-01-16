const ETH_DEFAULT = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0"
};

const ETH_TREZOR = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0"
};

const ETH_LEDGER = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'"
};

const ETC_LEDGER = {
  label: 'Ledger (ETC)',
  value: "m/44'/60'/160720'/0'"
};

const ETC_TREZOR = {
  label: 'TREZOR (ETC)',
  value: "m/44'/61'/0'/0"
};

const TESTNET = {
  label: 'Testnet',
  value: "m/44'/1'/0'/0"
};

const EXPANSE = {
  label: 'Expanse',
  value: "m/44'/40'/0'/0"
};

const TREZOR = [ETH_TREZOR, ETC_TREZOR, TESTNET];

const MNEMONIC = [ETH_DEFAULT, ETH_LEDGER, ETC_LEDGER, ETC_TREZOR, TESTNET, EXPANSE];

const LEDGER = [ETH_LEDGER, ETC_LEDGER, TESTNET];

// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3

// m / purpose' / coin_type' / account' / change / address_index
//   |          |            |          |        |
//   | constant |   index    |  index   | 0 or 1 |
//   |__________|____________|__________|________|

// whitespace strings are evaluated the same way as nospace strings, except they allow optional spaces between each portion of the string
// ie. "m / 44' / 0' / 0'" is valid, "m / 4 4' / 0' / 0'" is invalid
export const dPathRegex = /m\/44'\/[0-9]+\'\/[0-9]+(\'+$|\'+(\/[0-1]+$))/;
export const whitespaceDPathRegex = /m\s*\/\s*44'\s*\/\s*[0-9]+\'\s*\/\s*[0-9]+(\'+$|\'+\s*(\/\s*[0-1]+$))/;

export default {
  TREZOR,
  MNEMONIC,
  LEDGER
};
