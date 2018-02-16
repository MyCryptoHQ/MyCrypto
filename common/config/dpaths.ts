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
  value: "m/44'/60'/160720'/0'"
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

// PATHS TO BE INCLUDED REGARDLESS OF WALLET FORMAT
export const EXTRA_PATHS = [ETH_SINGULAR];
