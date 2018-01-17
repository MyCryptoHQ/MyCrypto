import { NetworkKeys, SecureWallets, InsecureWallets } from 'config';

export interface DPath {
  label: string;
  value: string; // TODO determine method for more precise typing for path
  network: NetworkKeys;
}

const ETH_DEFAULT: DPath = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0",
  network: 'ETH'
};

const ETH_TREZOR: DPath = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0",
  network: 'ETH'
};

const ETH_LEDGER: DPath = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'",
  network: 'ETH'
};

const ETC_LEDGER: DPath = {
  label: 'Ledger (ETC)',
  value: "m/44'/60'/160720'/0'",
  network: 'ETC'
};

const ETC_TREZOR: DPath = {
  label: 'TREZOR (ETC)',
  value: "m/44'/61'/0'/0",
  network: 'ETC'
};

const ETH_TESTNET: DPath = {
  label: 'Testnet (ETH)',
  value: "m/44'/1'/0'/0",
  network: 'Ropsten'
};

const EXP_DEFAULT: DPath = {
  label: 'Default (EXP)',
  value: "m/44'/40'/0'/0",
  network: 'EXP'
};

const UBIQ_DEFAULT: DPath = {
  label: 'Default (UBIQ)',
  value: "m/44'/108'/0'/0",
  network: 'UBIQ'
};

const TREZOR: DPath[] = [ETH_TREZOR, ETC_TREZOR, ETH_TESTNET, EXP_DEFAULT, UBIQ_DEFAULT];

const MNEMONIC: DPath[] = [
  ETH_DEFAULT,
  ETH_LEDGER,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBIQ_DEFAULT
];

const LEDGER: DPath[] = [ETH_LEDGER, ETC_LEDGER, ETH_TESTNET, EXP_DEFAULT, UBIQ_DEFAULT];

export const DPATHS = {
  [SecureWallets.TREZOR]: TREZOR,
  [InsecureWallets.MNEMONIC_PHRASE]: MNEMONIC,
  [SecureWallets.LEDGER_NANO_S]: LEDGER
};
