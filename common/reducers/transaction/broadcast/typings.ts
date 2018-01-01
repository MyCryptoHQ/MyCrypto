export interface ITransactionStatus {
  serializedTransaction: Buffer;
  broadcastedHash: string | null;
  isBroadcasting: boolean;
  broadcastSuccessful: boolean;
}

export interface State {
  [indexingHash: string]: ITransactionStatus | null;
}
