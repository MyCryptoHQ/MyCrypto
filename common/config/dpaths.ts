export const ETH_DEFAULT: DPath = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0"
};

export const ETH_TREZOR: DPath = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0"
};

export const ETH_SAFE_T: DPath = {
  label: 'Safe-T (ETH)',
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

export const ETC_SAFE_T: DPath = {
  label: 'Safe-T (ETC)',
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

export const POA_DEFAULT: DPath = {
  label: 'Default (POA)',
  value: "m/44'/60'/0'/0"
};

export const TOMO_DEFAULT: DPath = {
  label: 'Default (TOMO)',
  value: "m/44'/1'/0'/0"
};

export const ELLA_DEFAULT: DPath = {
  label: 'Default (ELLA)',
  value: "m/44'/163'/0'/0"
};

export const MUSIC_DEFAULT: DPath = {
  label: 'Default (MUSIC)',
  value: "m/44'/184'/0'/0"
};

export const ETSC_DEFAULT: DPath = {
  label: 'Default (ETSC)',
  value: "m/44'/1128'/0'/0"
};

export const EGEM_DEFAULT: DPath = {
  label: 'Default (EGEM)',
  value: "m/44'/1987'/0'/0"
};

export const CLO_DEFAULT: DPath = {
  label: 'Default (CLO)',
  value: "m/44'/820'/0'/0"
};

export const ETH_SINGULAR: DPath = {
  label: 'SingularDTV',
  value: "m/0'/0'/0'"
};

export const RSK_TESTNET: DPath = {
  label: 'Testnet (RSK)',
  value: "m/44'/37310'/0'/0"
};

export const RSK_MAINNET: DPath = {
  label: 'Mainnet (RSK)',
  value: "m/44'/137'/0'/0"
};

export const GO_DEFAULT: DPath = {
  label: 'Default (GO)',
  value: "m/44'/6060'/0'/0"
};

export const EOSC_DEFAULT: DPath = {
  label: 'Default (EOSC)',
  value: "m/44'/2018'/0'/0"
};

export const ESN_DEFAULT: DPath = {
  label: 'Default (ESN)',
  value: "m/44'/31102'/0'/0"
};

export const AQUA_DEFAULT: DPath = {
  label: 'Default (AQUA)',
  value: "m/44'/60'/0'/0"
};

export const AKA_DEFAULT: DPath = {
  label: 'Default (AKA)',
  value: "m/44'/200625'/0'/0"
};

export const PIRL_DEFAULT: DPath = {
  label: 'Default (PIRL)',
  value: "m/44'/164'/0'/0"
};

export const ATH_DEFAULT: DPath = {
  label: 'Default (ATH)',
  value: "m/44'/1620'/0'/0"
};

export const ETHO_DEFAULT: DPath = {
  label: 'Default (ETHO)',
  value: "m/44'/1313114'/0'/0"
};

export const MIX_DEFAULT: DPath = {
  label: 'Default (MIX)',
  value: "m/44'/76'/0'/0"
};

export const REOSC_DEFAULT: DPath = {
  label: 'Default (REOSC)',
  value: "m/44'/2894'/0'/0"
};

export const DPaths: DPath[] = [
  ETH_DEFAULT,
  ETH_TREZOR,
  ETH_SAFE_T,
  ETH_LEDGER,
  ETC_LEDGER,
  ETC_TREZOR,
  ETC_SAFE_T,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBQ_DEFAULT,
  POA_DEFAULT,
  TOMO_DEFAULT,
  ELLA_DEFAULT,
  MUSIC_DEFAULT,
  ETSC_DEFAULT,
  EGEM_DEFAULT,
  CLO_DEFAULT,
  RSK_MAINNET,
  RSK_TESTNET,
  GO_DEFAULT,
  EOSC_DEFAULT,
  ESN_DEFAULT,
  AQUA_DEFAULT,
  AKA_DEFAULT,
  PIRL_DEFAULT,
  ATH_DEFAULT,
  ETHO_DEFAULT,
  MIX_DEFAULT,
  REOSC_DEFAULT
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
export const dPathRegex = /m\/44'\/[0-9]+\'\/[0-9]+(\'+$|\'+(\/[0-1]+$))/;
// export const whitespaceDPathRegex = /m\s*\/\s*44'\s*\/\s*[0-9]+\'\s*\/\s*[0-9]+(\'+$|\'+\s*(\/\s*[0-1]+$))/;
