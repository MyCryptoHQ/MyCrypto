export interface State {
  local: {
    signedTransaction: Buffer | null;
  };
  web3: {
    transaction: Buffer | null;
  };
}
