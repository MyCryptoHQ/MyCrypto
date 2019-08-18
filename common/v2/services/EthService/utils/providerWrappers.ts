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
  blockNum: string,
  provider: ProviderHandler
): Promise<number | undefined> =>
  await provider
    .getBlockByHash(blockNum)
    .then(block => {
      return block.timestamp;
    })
    .catch(_ => {
      return undefined;
    });
