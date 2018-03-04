import EthTx from 'ethereumjs-tx';
import { toChecksumAddress } from 'ethereumjs-util';
import { SavedTransaction } from 'types/transactions';
import { getTransactionFields } from 'libs/transaction';
import { hexEncodeData } from 'libs/nodes/rpc/utils';

export function ethtxToRecentTransaction(tx: EthTx, hash: string): SavedTransaction {
  const fields = getTransactionFields(tx);
  const from = hexEncodeData(tx.getSenderAddress());
  return {
    hash,
    to: toChecksumAddress(fields.to),
    from: toChecksumAddress(from),
    value: fields.value,
    chainId: fields.chainId,
    time: Date.now()
  };
}
