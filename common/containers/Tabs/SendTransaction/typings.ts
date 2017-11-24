import { IWallet } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';
import { NetworkConfig } from 'config/data';
import { BroadcastTransactionStatus } from 'libs/transaction';
import { TShowNotification } from 'actions/notifications';
import { TBroadcastTx, TResetWallet } from 'actions/wallet';

export interface State {
  hasQueryString: boolean;
  readOnly: boolean;
  transaction: CompleteTransaction | null;
  showTxConfirm: boolean;
  generateDisabled: boolean;
  generateTxProcessing: boolean;
}

export interface Props {
  wallet: IWallet;
  nodeLib: RPCNode;
  network: NetworkConfig;
  transactions: BroadcastTransactionStatus[];
  showNotification: TShowNotification;
  broadcastTx: TBroadcastTx;
  resetWallet: TResetWallet;
}

export const initialState: State = {
  hasQueryString: false,
  readOnly: false,
  showTxConfirm: false,
  transaction: null,
  generateDisabled: true,
  generateTxProcessing: false
};
