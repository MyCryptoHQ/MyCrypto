import * as types from 'v2/services';

export const WalletTypes: Record<string, types.Wallet> = {
  metamask: {
    name: 'MetaMask',
    key: 'metamask',
    secure: true,
    derivationPath: '',
    web3: true,
    hardware: false,
    desktopOnly: false
  },
  ledger: {
    name: 'Ledger',
    key: 'ledger',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true,
    desktopOnly: false
  },
  trezor: {
    name: 'Trezor',
    key: 'trezor',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true,
    desktopOnly: false
  },
  keystore: {
    name: 'JSON Keystore File',
    key: 'keystore',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  mnemonic: {
    name: 'Mnemonic Phrase',
    key: 'mnemonic',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  privatekey: {
    name: 'Private Key',
    key: 'privatekey',
    secure: false,
    derivationPath: '',
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  paritysigner: {
    name: 'MetaMask',
    key: 'metamask',
    secure: true,
    derivationPath: '',
    web3: true,
    hardware: false,
    desktopOnly: false
  },
  safetmini: {
    name: 'Safe-T Mini',
    key: 'safetmini',
    secure: true,
    derivationPath: '',
    web3: false,
    hardware: true,
    desktopOnly: false
  }
};
