import { InsecureWalletName, SecureWalletName } from 'config';
import { MetaAction } from './meta';
import { CustomNetworkAction } from './networks';
import { SelectedNodeAction, StaticNodeAction, CustomNodeAction } from './nodes';

export enum CONFIG {
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS'
}

export interface PollOfflineStatus {
  type: CONFIG.POLL_OFFLINE_STATUS;
}

export type NodeAction = SelectedNodeAction | StaticNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
