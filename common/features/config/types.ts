import { InsecureWalletName, SecureWalletName } from 'config';
import { MetaState, MetaAction } from './meta/types';
import { CustomNetworkAction } from './networks/custom/types';
import { NetworksState } from './networks/types';
import { CustomNodeAction } from './nodes/custom/types';
import { SelectedNodeAction } from './nodes/selected/types';
import { StaticNodeAction } from './nodes/static/types';
import { NodesState } from './nodes/types';

export enum CONFIG {
  POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS'
}

export interface ConfigState {
  meta: MetaState;
  networks: NetworksState;
  nodes: NodesState;
}

export interface PollOfflineStatus {
  type: CONFIG.POLL_OFFLINE_STATUS;
}

export type NodeAction = SelectedNodeAction | StaticNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.SAFE_T
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
