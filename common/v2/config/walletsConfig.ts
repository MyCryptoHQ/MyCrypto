import { filterObjectOfObjects } from 'v2/utils/filterObjectOfObjects';
import { EWalletType, WalletId } from 'v2/types';

export interface IWalletConfig {
  id: WalletId;
  name: string;
  isDeterministic: boolean;
  isSecure: boolean;
  isDesktopOnly: boolean;
  type: EWalletType;
}

export const WALLETS_CONFIG: Record<WalletId, IWalletConfig> = {
  [WalletId.METAMASK]: {
    id: WalletId.METAMASK,
    name: 'MetaMask',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: EWalletType.WEB3
  },
  [WalletId.LEDGER_NANO_S]: {
    id: WalletId.LEDGER_NANO_S,
    name: 'Ledger Nano S',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: EWalletType.HARDWARE
  },
  [WalletId.TREZOR]: {
    id: WalletId.TREZOR,
    name: 'Trezor',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: EWalletType.HARDWARE
  },
  [WalletId.SAFE_T_MINI]: {
    id: WalletId.SAFE_T_MINI,
    name: 'Safe-T Mini',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: EWalletType.HARDWARE
  },
  [WalletId.PARITY_SIGNER]: {
    id: WalletId.PARITY_SIGNER,
    name: 'Parity Signer',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: false,
    type: EWalletType.MISC
  },
  [WalletId.KEYSTORE_FILE]: {
    id: WalletId.KEYSTORE_FILE,
    name: 'JSON Keystore File',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: EWalletType.FILE
  },
  [WalletId.PRIVATE_KEY]: {
    id: WalletId.PRIVATE_KEY,
    name: 'Private Key',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: EWalletType.FILE
  },
  [WalletId.MNEMONIC_PHRASE]: {
    id: WalletId.MNEMONIC_PHRASE,
    name: 'Mnemonic Phrase',
    isDeterministic: true,
    isSecure: false,
    isDesktopOnly: true,
    type: EWalletType.FILE
  },
  [WalletId.VIEW_ONLY]: {
    id: WalletId.VIEW_ONLY,
    name: 'View Only',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: EWalletType.MISC
  }
};

// TODO research Pick with dynamic keys for better type saftey.
// lead https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type WalletSubType = Partial<Record<WalletId, IWalletConfig>>;

export const HD_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)('isDeterministic');
export const SECURE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)('isSecure');
export const INSECURE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)(
  ({ isSecure }: { isSecure: boolean }) => !isSecure
);
export const HARDWARE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)(
  ({ type }: { type: EWalletType }) => type === EWalletType.HARDWARE
);
