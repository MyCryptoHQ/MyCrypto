import * as types from 'v2/services';

export const ACCOUNTTYPES: Record<string, types.AccountType> = {
  metamask: {
    name: 'MetaMask',
    key: 'metamask',
    secure: true,
    derivationPath: '',
    web3: true,
    hardware: false
  },
  ledger: {
    name: 'Ledger',
    key: 'ledger',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true
  },
  trezor: {
    name: 'Trezor',
    key: 'trezor',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true
  },
  keystore: {
    name: 'JSON Keystore File',
    key: 'keystore',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false
  },
  mnemonic: {
    name: 'Mnemonic Phrase',
    key: 'mnemonic',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false
  },
  privatekey: {
    name: 'Private Key',
    key: 'privatekey',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false
  },
  paritysigner: {
    name: 'MetaMask',
    key: 'metamask',
    secure: true,
    derivationPath: '',
    web3: true,
    hardware: false
  },
  safetmini: {
    name: 'Safe-T Mini',
    key: 'safetmini',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true
  }
};
