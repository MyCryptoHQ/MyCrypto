import { TransactionReceipt } from '@ethersproject/providers';

import { ITxStatus } from '@types';

import { ProviderHandler } from '../network/providerHandler';

export const getStatusFromHash = async (
  txHash: string,
  provider: ProviderHandler
): Promise<boolean | undefined> =>
  await provider
    .getTransactionReceipt(txHash)
    .then((receipt) => {
      return receipt.status === 1 ? true : false;
    })
    .catch(() => {
      return undefined;
    });

export const getTimestampFromBlockNum = async (
  blockNum: number,
  provider: ProviderHandler
): Promise<number | undefined> =>
  await provider
    .getBlockByNumber(blockNum)
    .then((block) => {
      return block.timestamp;
    })
    .catch(() => {
      return undefined;
    });

export const getTransactionReceiptFromHash = async (
  txHash: string,
  provider: ProviderHandler
): Promise<TransactionReceipt | undefined> =>
  await provider
    .getTransactionReceipt(txHash)
    .then((receipt) => receipt)
    .catch(() => {
      return undefined;
    });

export const getTxStatus = (providerInstance: ProviderHandler, txHash: string) =>
  getTransactionReceiptFromHash(txHash, providerInstance).then(({ status }: any) => {
    // Status will return 0 or 1 which is used to indicate success or failure of tx.
    // If tx is not found, no `status` is returned, leaving this as undefined.
    if (![0, 1].includes(status)) return;
    return status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
  });
