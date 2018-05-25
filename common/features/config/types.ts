import { InsecureWalletName, SecureWalletName } from 'config';
import { DPathFormats } from 'types/network';
import { CustomNetworkAction } from './networks';
import { MetaAction } from './meta';
import { SelectedNodeAction, StaticNodeAction, CustomNodeAction } from './nodes';

export enum CONFIG {
  NODE_CHANGE_INTENT_ONETIME = 'CONFIG_NODE_CHANGE_INTENT_ONETIME',
  NODE_CHANGE_FORCE = 'CONFIG_NODE_CHANGE_FORCE',
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS'
}

export interface PollOfflineStatus {
  type: CONFIG.POLL_OFFLINE_STATUS;
}

export interface ChangeNodeIntentOneTimeAction {
  type: CONFIG.NODE_CHANGE_INTENT_ONETIME;
  payload: string;
}

export interface ChangeNodeForceAction {
  type: CONFIG.NODE_CHANGE_FORCE;
  payload: string;
}

export type NodeAction = SelectedNodeAction | StaticNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

export type PathType = keyof DPathFormats;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
