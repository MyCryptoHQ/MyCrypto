export * from './utils';
export * from './typings';

/*

export async function confirmAndSendWeb3Transaction(
  wallet: Web3Wallet,
  nodeLib: RPCNode,
  gasPrice: Wei,
  gasLimit: Wei,
  chainId: number,
  transactionInput: TransactionInput
): Promise<string> {
  const { from, to, value, data } = await formatTxInput(
    wallet,
    transactionInput
  );
  const transaction: ExtendedRawTransaction = {
    nonce: await nodeLib.getTransactionCount(from),
    from,
    to,
    gasLimit,
    value,
    data,
    chainId,
    gasPrice
  };

  return wallet.sendTransaction(transaction);
}
*/
