export interface State {
  indexingHash: string | null;
  pending: boolean;
  local: {
    signedTransaction: Buffer | null;
  };
  web3: {
    transaction: Buffer | null;
  };
}
