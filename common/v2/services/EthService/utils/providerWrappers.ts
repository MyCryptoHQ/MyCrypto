import { TransactionReceipt } from 'ethers/providers';

import { ProviderHandler } from '../network/providerHandler';

export const getStatusFromHash = async (
  txHash: string,
  provider: ProviderHandler
): Promise<boolean | undefined> =>
  await provider
    .getTransactionReceipt(txHash)
    .then(receipt => {
      return receipt.status === 1 ? true : false;
    })
    .catch(_ => {
      return undefined;
    });

export const getTimestampFromBlockNum = async (
  blockNum: number,
  provider: ProviderHandler
): Promise<number | undefined> =>
  await provider
    .getBlockByNumber(blockNum)
    .then(block => {
      return block.timestamp;
    })
    .catch(_ => {
      return undefined;
    });

export const getTransactionReceiptFromHash = async (
  txHash: string,
  provider: ProviderHandler
): Promise<TransactionReceipt | undefined> =>
  await provider
    .getTransactionReceipt(txHash)
    .then(receipt => receipt)
    .catch(_ => {
      return undefined;
    });
