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

export default {
  TREZOR,
  MNEMONIC,
  LEDGER
};
