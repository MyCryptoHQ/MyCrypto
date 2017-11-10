export interface State {
  hasQueryString: boolean;
  readOnly: boolean;
  to: string;
  // amount value
  value: string;
  unit: UnitKey;
  token?: MergedToken | null;
  gasLimit: string;
  data: string;
  gasChanged: boolean;
  transaction: CompleteTransaction | null;
  showTxConfirm: boolean;
  generateDisabled: boolean;
  nonce: number | null | undefined;
  hasSetDefaultNonce: boolean;
  generateTxProcessing: boolean;
  walletAddress: string | null;
}

export interface Props {
  wallet: IWallet;
  balance: Wei;
  nodeLib: RPCNode;
  network: NetworkConfig;
  tokens: MergedToken[];
  tokenBalances: TokenBalance[];
  gasPrice: Wei;
  transactions: BroadcastTransactionStatus[];
  showNotification: TShowNotification;
  broadcastTx: TBroadcastTx;
  resetWallet: TResetWallet;
  offline: boolean;
  forceOffline: boolean;
  pollOfflineStatus: TPollOfflineStatus;
  location: { search: string };
}

export const initialState: State = {
  hasQueryString: false,
  readOnly: false,
  to: '',
  value: '',
  unit: 'ether',
  token: null,
  gasLimit: '21000',
  data: '',
  gasChanged: false,
  showTxConfirm: false,
  transaction: null,
  generateDisabled: true,
  nonce: null,
  hasSetDefaultNonce: false,
  generateTxProcessing: false,
  walletAddress: null
};
