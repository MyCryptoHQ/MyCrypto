import { DerivationPath as DPath } from '@mycrypto/wallets';

const ETH_DEFAULT: DPath = {
  name: 'Default (ETH)',
  path: "m/44'/60'/0'/0/<account>"
};

const ETH_TREZOR: DPath = {
  name: 'TREZOR (ETH)',
  path: "m/44'/60'/0'/0/<account>"
};

const ETH_LEDGER: DPath = {
  name: 'Ledger (ETH)',
  path: "m/44'/60'/0'/<account>"
};

const ETH_LEDGER_LIVE: DPath = {
  name: 'Ledger Live (ETH)',
  path: `m/44'/60'/<account>'/0/0`,
  isHardened: true
};

const ETC_LEDGER: DPath = {
  name: 'Ledger (ETC)',
  path: "m/44'/60'/160720'/0'/<account>"
};

const ETC_TREZOR: DPath = {
  name: 'TREZOR (ETC)',
  path: "m/44'/61'/0'/0/<account>"
};

const ETH_TESTNET: DPath = {
  name: 'Testnet (ETH)',
  path: "m/44'/1'/0'/0/<account>"
};

const EXP_DEFAULT: DPath = {
  name: 'Default (EXP)',
  path: "m/44'/40'/0'/0/<account>"
};

const UBQ_DEFAULT: DPath = {
  name: 'Default (UBQ)',
  path: "m/44'/108'/0'/0/<account>"
};

const POA_DEFAULT: DPath = {
  name: 'Default (POA)',
  path: "m/44'/60'/0'/0/<account>"
};

const TOMO_DEFAULT: DPath = {
  name: 'Default (TOMO)',
  path: "m/44'/889'/0'/0/<account>"
};

const EGEM_DEFAULT: DPath = {
  name: 'Default (EGEM)',
  path: "m/44'/1987'/0'/0/<account>"
};

const CLO_DEFAULT: DPath = {
  name: 'Default (CLO)',
  path: "m/44'/820'/0'/0/<account>"
};

const ETH_SINGULAR: DPath = {
  name: 'SingularDTV',
  path: "m/0'/0'/0'/<account>"
};

const RSK_TESTNET: DPath = {
  name: 'Testnet (RSK)',
  path: "m/44'/37310'/0'/0/<account>"
};

const RSK_MAINNET: DPath = {
  name: 'Mainnet (RSK)',
  path: "m/44'/137'/0'/0/<account>"
};

const GO_DEFAULT: DPath = {
  name: 'Default (GO)',
  path: "m/44'/6060'/0'/0/<account>"
};

const ATH_DEFAULT: DPath = {
  name: 'Default (ATH)',
  path: "m/44'/1620'/0'/0/<account>"
};

const ETHO_DEFAULT: DPath = {
  name: 'Default (ETHO)',
  path: "m/44'/1313114'/0'/0/<account>"
};

const MIX_DEFAULT: DPath = {
  name: 'Default (MIX)',
  path: "m/44'/76'/0'/0/<account>"
};

const REOSC_DEFAULT: DPath = {
  name: 'Default (REOSC)',
  path: "m/44'/2894'/0'/0/<account>"
};

const ARTIS_SIGMA1: DPath = {
  name: 'Sigma1 (ATS)',
  path: "m/44'/60'/0'/0/<account>"
};

const ARTIS_TAU1: DPath = {
  name: 'Tau1 (ATS)',
  path: "m/44'/60'/0'/0/<account>"
};

const THUNDERCORE_DEFAULT: DPath = {
  name: 'Default (THUNDERCORE)',
  path: "m/44'/1001'/0'/0/<account>"
};

const ETI_DEFAULT: DPath = {
  name: 'Default (ETI)',
  path: "m/44'/464'/0'/0/<account>"
};
const WEB_DEFAULT: DPath = {
  name: 'Default (WEB)',
  path: "m/44'/227'/0'/0/<account>"
};

const METADIUM_DEFAULT: DPath = {
  name: 'Default (METADIUM)',
  path: "m/44'/916'/0'/0/<account>"
};

const DEXON_DEFAULT: DPath = {
  name: 'Default (DEXON)',
  path: "m/44'/237'/0'/0/<account>"
};

const ASK_DEFAULT: DPath = {
  name: 'Default (ASK)',
  path: "m/44'/2221'/0'/0/<account>"
};

const ASK_TREZOR: DPath = {
  name: 'TREZOR (ASK)',
  path: "m/44'/2221'/0'/0/<account>"
};

const AUX_DEFAULT: DPath = {
  name: 'Default (AUX)',
  path: "m/44'/344'/0'/0/<account>"
};

const ERE_DEFAULT: DPath = {
  name: 'Default (ERE)',
  path: "m/44'/466'/0'/0/<account>"
};

const VOLTA_DEFAULT: DPath = {
  name: 'Default (VOLTA)',
  path: "m/44'/73799'/0'/0/<account>"
};

const EWC_DEFAULT: DPath = {
  name: 'Default (EWC)',
  path: "m/44'/246'/0'/0/<account>"
};

const AVAX_DEFAULT: DPath = {
  name: 'Default (AVAX)',
  path: "m/44'/60'/0'/0/<account>"
};

const EVRICE_DEFAULT: DPath = {
  name: 'Default (EVC)',
  path: "m/44'/1020'/0'/0/<account>"
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
  EVRICE_DEFAULT
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
