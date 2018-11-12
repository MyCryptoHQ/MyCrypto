import { InsecureWalletName, SecureWalletName } from 'config';
import * as configMetaTypes from './meta/types';
import * as configNetworksCustomTypes from './networks/custom/types';
import * as configNetworksTypes from './networks/types';
import * as configNodesCustomTypes from './nodes/custom/types';
import * as configNodesSelectedTypes from './nodes/selected/types';
import * as configNodesStaticTypes from './nodes/static/types';
import * as configNodesTypes from './nodes/types';

export enum ConfigActions {
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS'
}

export interface ConfigState {
  meta: configMetaTypes.ConfigMetaState;
  networks: configNetworksTypes.ConfigNetworksState;
  nodes: configNodesTypes.ConfigNodesState;
}

export interface PollOfflineStatus {
  type: ConfigActions.POLL_OFFLINE_STATUS;
}

export type NodeAction =
  | configNodesSelectedTypes.SelectedNodeAction
  | configNodesStaticTypes.StaticNodeAction;

export type ConfigAction =
  | configNetworksCustomTypes.CustomNetworkAction
  | configNodesCustomTypes.CustomNodeAction
  | NodeAction
  | configMetaTypes.MetaAction;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.SAFE_T
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
