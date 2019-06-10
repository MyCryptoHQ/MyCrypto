import * as types from 'v2/services';

export const WalletTypes: Record<string, types.Wallet> = {
  metamask: {
    name: 'MetaMask',
    key: 'metamask',
    secure: true,
    web3: true,
    hardware: false,
    desktopOnly: false
  },
  ledger: {
    name: 'Ledger',
    key: 'ledger',
    secure: true,
    web3: false,
    hardware: true,
    desktopOnly: false
  },
  trezor: {
    name: 'Trezor',
    key: 'trezor',
    secure: true,
    web3: false,
    hardware: true,
    desktopOnly: false
  },
  keystore: {
    name: 'JSON Keystore File',
    key: 'keystore',
    secure: false,
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  mnemonic: {
    name: 'Mnemonic Phrase',
    key: 'mnemonic',
    secure: false,
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  privatekey: {
    name: 'Private Key',
    key: 'privatekey',
    secure: false,
    web3: false,
    hardware: false,
    desktopOnly: true
  },
  paritysigner: {
    name: 'Parity Signer',
    key: 'paritySigner',
    secure: true,
    web3: false,
    hardware: false,
    desktopOnly: false
  },
  safetmini: {
    name: 'Safe-T Mini',
    key: 'safetmini',
    secure: true,
    web3: false,
    hardware: true,
    desktopOnly: false
  }
};
