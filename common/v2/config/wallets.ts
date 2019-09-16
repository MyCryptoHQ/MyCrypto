import { filterObject } from 'v2/utils';

// For extra type safety we define the names that are valid keys
enum WalletId {
  METAMASK = 'METAMASK',
  LEDGER_NANO_S = 'LEDGER_NANO_S',
  TREZOR = 'TREZOR',
  KEYSTORE = 'KEYSTORE',
  MNEMONIC_PHRASE = 'MNEMONIC_PHRASE',
  PRIVATE_KEY = 'PRIVATE_KEY',
  PARITY_SIGNER = 'PARITY_SIGNER',
  SAFE_T_MINI = 'SAFE_T_MINI',
  VIEW_ONLY = 'VIEW_ONLY'
}

export enum WalletType {
  WEB3 = 'WEB3',
  HARDWARE = 'HARDWARE',
  FILE = 'FILE',
  MISC = 'MISC'
}

export interface IWallet {
  id: WalletId;
  name: string;
  isDeterministic: boolean;
  isSecure: boolean;
  isDesktopOnly: boolean;
  type: WalletType;
}

export const WALLETS: Record<WalletId, IWallet> = {
  [WalletId.METAMASK]: {
    id: WalletId.METAMASK,
    name: 'MetaMask',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3
  },
  [WalletId.LEDGER_NANO_S]: {
    id: WalletId.LEDGER_NANO_S,
    name: 'Ledger Nano S',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE
  },
  [WalletId.TREZOR]: {
    id: WalletId.TREZOR,
    name: 'Trezor',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE
  },
  [WalletId.SAFE_T_MINI]: {
    id: WalletId.SAFE_T_MINI,
    name: 'Safe-T Mini',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE
  },
  [WalletId.PARITY_SIGNER]: {
    id: WalletId.PARITY_SIGNER,
    name: 'Parity Signer',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: false,
    type: WalletType.MISC
  },
  [WalletId.KEYSTORE]: {
    id: WalletId.KEYSTORE,
    name: 'JSON Keystore File',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE
  },
  [WalletId.PRIVATE_KEY]: {
    id: WalletId.PRIVATE_KEY,
    name: 'Private Key',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE
  },
  [WalletId.MNEMONIC_PHRASE]: {
    id: WalletId.MNEMONIC_PHRASE,
    name: 'Mnemonic Phrase',
    isDeterministic: true,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE
  },
  [WalletId.VIEW_ONLY]: {
    id: WalletId.VIEW_ONLY,
    name: 'View Only',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.MISC
  }
};

export const isSecure = filterObject(WALLETS)('isSecure');
export const isHardware = filterObject(WALLETS)(
  ({ type }: { type: WalletType }) => type === WalletType.HARDWARE
);
