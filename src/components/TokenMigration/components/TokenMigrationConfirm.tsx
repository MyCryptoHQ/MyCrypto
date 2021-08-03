import { ConfirmTransaction } from '@components';
import { ITokenMigrationConfig, ITxMultiConfirmProps, ITxType, StoreAccount } from '@types';

import { makeTokenMigrationTxConfig } from '../helpers';

export default function ConfirmTokenMigration({
  account,
  amount,
  currentTxIdx,
  flowConfig,
  transactions,
  onComplete
}: ITxMultiConfirmProps & { account: StoreAccount; amount: string }) {
  const currentTx = transactions[currentTxIdx];

  const complete = () => onComplete && onComplete();

  const txConfig = makeTokenMigrationTxConfig(
    currentTx.txRaw,
    account,
    amount
  )(flowConfig as ITokenMigrationConfig);

  return (
    <ConfirmTransaction
      onComplete={complete}
      resetFlow={complete}
      txConfig={txConfig}
      txType={currentTx.txType || ITxType.STANDARD}
    />
  );
}
