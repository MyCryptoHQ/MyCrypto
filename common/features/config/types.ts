import { InsecureWalletName, SecureWalletName } from 'config';
import { DPathFormats } from 'types/network';
import { CustomNetworkAction } from './networks';
import { MetaAction } from './meta';
import { SelectedNodeAction, StaticNodeAction, CustomNodeAction } from './nodes';

export enum CONFIG {
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS',
  CHANGE_NETWORK_REQUESTED = 'CONFIG_NODES_SELECTED_CHANGE_NETWORK_REQUESTED'
}

export interface PollOfflineStatus {
  type: CONFIG.POLL_OFFLINE_STATUS;
}

export interface ChangeNetworkRequestedAction {
  type: CONFIG.CHANGE_NETWORK_REQUESTED;
  payload: string;
}

export type NodeAction = SelectedNodeAction | StaticNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

export type PathType = keyof DPathFormats;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
