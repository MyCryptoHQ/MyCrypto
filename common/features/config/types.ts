import { InsecureWalletName, SecureWalletName } from 'config';
import { DPathFormats } from 'types/network';
import { CustomNetworkAction } from './networks/custom';
import { MetaAction } from './meta';
import { SelectedNodeAction } from './nodes/selected';
import { StaticNodeAction } from './nodes/static';
import { CustomNodeAction } from './nodes/custom';

export enum CONFIG {
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS'
}

export interface PollOfflineStatus {
  type: CONFIG.POLL_OFFLINE_STATUS;
}

export type NodeAction = SelectedNodeAction | StaticNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

export type PathType = keyof DPathFormats;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
