export interface State {
  indexingHash: string | null;
  local: {
    signedTransaction: Buffer | null;
  };
  web3: {
    transaction: Buffer | null;
  };
}
