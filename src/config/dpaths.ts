import { DPath } from '@types';

const ETH_DEFAULT: DPath = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0"
};

const ETH_TREZOR: DPath = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0"
};

const ETH_LEDGER: DPath = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'"
};

const ETH_LEDGER_LIVE: DPath = {
  label: 'Ledger Live (ETH)',
  value: `m/44'/60'/addrIndex'/0/0`,
  isHardened: true
};

const ETC_LEDGER: DPath = {
  label: 'Ledger (ETC)',
  value: "m/44'/60'/160720'/0'"
};

const ETC_TREZOR: DPath = {
  label: 'TREZOR (ETC)',
  value: "m/44'/61'/0'/0"
};

const ETH_TESTNET: DPath = {
  label: 'Testnet (ETH)',
  value: "m/44'/1'/0'/0"
};

const EXP_DEFAULT: DPath = {
  label: 'Default (EXP)',
  value: "m/44'/40'/0'/0"
};

const UBQ_DEFAULT: DPath = {
  label: 'Default (UBQ)',
  value: "m/44'/108'/0'/0"
};

const POA_DEFAULT: DPath = {
  label: 'Default (POA)',
  value: "m/44'/60'/0'/0"
};

const TOMO_DEFAULT: DPath = {
  label: 'Default (TOMO)',
  value: "m/44'/889'/0'/0"
};

const EGEM_DEFAULT: DPath = {
  label: 'Default (EGEM)',
  value: "m/44'/1987'/0'/0"
};

const CLO_DEFAULT: DPath = {
  label: 'Default (CLO)',
  value: "m/44'/820'/0'/0"
};

const ETH_SINGULAR: DPath = {
  label: 'SingularDTV',
  value: "m/0'/0'/0'"
};

const RSK_TESTNET: DPath = {
  label: 'Testnet (RSK)',
  value: "m/44'/37310'/0'/0"
};

const RSK_MAINNET: DPath = {
  label: 'Mainnet (RSK)',
  value: "m/44'/137'/0'/0"
};

const GO_DEFAULT: DPath = {
  label: 'Default (GO)',
  value: "m/44'/6060'/0'/0"
};

const ATH_DEFAULT: DPath = {
  label: 'Default (ATH)',
  value: "m/44'/1620'/0'/0"
};

const ETHO_DEFAULT: DPath = {
  label: 'Default (ETHO)',
  value: "m/44'/1313114'/0'/0"
};

const MIX_DEFAULT: DPath = {
  label: 'Default (MIX)',
  value: "m/44'/76'/0'/0"
};

const REOSC_DEFAULT: DPath = {
  label: 'Default (REOSC)',
  value: "m/44'/2894'/0'/0"
};

const ARTIS_SIGMA1: DPath = {
  label: 'Sigma1 (ATS)',
  value: "m/44'/60'/0'/0"
};

const ARTIS_TAU1: DPath = {
  label: 'Tau1 (ATS)',
  value: "m/44'/60'/0'/0"
};

const THUNDERCORE_DEFAULT: DPath = {
  label: 'Default (THUNDERCORE)',
  value: "m/44'/1001'/0'/0"
};

const ETI_DEFAULT: DPath = {
  label: 'Default (ETI)',
  value: "m/44'/464'/0'/0"
};
const WEB_DEFAULT: DPath = {
  label: 'Default (WEB)',
  value: "m/44'/227'/0'/0"
};

const METADIUM_DEFAULT: DPath = {
  label: 'Default (METADIUM)',
  value: "m/44'/916'/0'/0"
};

const DEXON_DEFAULT: DPath = {
  label: 'Default (DEXON)',
  value: "m/44'/237'/0'/0"
};

const ASK_DEFAULT: DPath = {
  label: 'Default (ASK)',
  value: "m/44'/2221'/0'/0"
};

const ASK_TREZOR: DPath = {
  label: 'TREZOR (ASK)',
  value: "m/44'/2221'/0'/0"
};

const AUX_DEFAULT: DPath = {
  label: 'Default (AUX)',
  value: "m/44'/344'/0'/0"
};

const ERE_DEFAULT: DPath = {
  label: 'Default (ERE)',
  value: "m/44'/466'/0'/0"
};

const VOLTA_DEFAULT: DPath = {
  label: 'Default (VOLTA)',
  value: "m/44'/73799'/0'/0"
};

const EWC_DEFAULT: DPath = {
  label: 'Default (EWC)',
  value: "m/44'/246'/0'/0"
};

const AVAX_DEFAULT: DPath = {
  label: 'Default (AVAX)',
  value: "m/44'/60'/0'/0"
};

const EVRICE_DEFAULT: DPath = {
  label: 'Default (EVC)',
  value: "m/44'/1020'/0'/0"
};

const XLON_DEFAULT: DPath = {
  label: 'Default (XLON)',
  value: "m/44'/22052002'/0'/0"
};

export const DPathsList = {
  ETH_DEFAULT,
  ETH_TREZOR,
  ETH_LEDGER,
  ETH_LEDGER_LIVE,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBQ_DEFAULT,
  POA_DEFAULT,
  TOMO_DEFAULT,
  EGEM_DEFAULT,
  CLO_DEFAULT,
  RSK_MAINNET,
  RSK_TESTNET,
  GO_DEFAULT,
  ATH_DEFAULT,
  ETHO_DEFAULT,
  MIX_DEFAULT,
  REOSC_DEFAULT,
  ARTIS_SIGMA1,
  ARTIS_TAU1,
  THUNDERCORE_DEFAULT,
  ETI_DEFAULT,
  WEB_DEFAULT,
  METADIUM_DEFAULT,
  DEXON_DEFAULT,
  ASK_DEFAULT,
  ASK_TREZOR,
  AUX_DEFAULT,
  ETH_SINGULAR,
  ERE_DEFAULT,
  VOLTA_DEFAULT,
  EWC_DEFAULT,
  AVAX_DEFAULT,
  EVRICE_DEFAULT,
  XLON_DEFAULT
};

// PATHS TO BE INCLUDED REGARDLESS OF WALLET FORMAT
// const EXTRA_PATHS = [ETH_SINGULAR];

// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3

// m / purpose' / coin_type' / account' / change / address_index
//   |          |            |          |        |
//   | constant |   index    |  index   | 0 or 1 |
//   |__________|____________|__________|________|

// whitespace strings are evaluated the same way as nospace strings, except they allow optional spaces between each portion of the string
// ie. "m / 44' / 0' / 0'" is valid, "m / 4 4' / 0' / 0'" is invalid
export const dPathRegex = /m\/4[4,9]'\/[0-9]+'\/[0-9]+('+$|'+(\/[0-1]+$))/;
// const whitespaceDPathRegex = /m\s*\/\s*44'\s*\/\s*[0-9]+\'\s*\/\s*[0-9]+(\'+$|\'+\s*(\/\s*[0-1]+$))/;

/**
 * Due to limitations in the Ledger ETH application, only derivation paths starting with
 * `m/44'/60'` and `m/44'/1'` can be checked.
 */
export const LEDGER_DERIVATION_PATHS: DPath[] = [
  ETH_DEFAULT,
  ETH_LEDGER,
  ETC_LEDGER,
  ETH_TESTNET,
  ETH_LEDGER_LIVE
];

/**
 * While Trezor does support hardened paths, it'd be very tedious for the user to check all the
 * paths currently, since the user would have to confirm each address individually.
 */
export const TREZOR_DERIVATION_PATHS: DPath[] = [
  ...Object.values(DPathsList).filter((path) => !path.isHardened)
];
