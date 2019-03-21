export interface TransactionHistory {
  transaction: string;
}

export interface ExtendedTransactionHistory extends TransactionHistory {
  uuid: string;
}
