import React from 'react';

import { ConfirmTransaction } from '@components';
import { ITxType, StoreAccount } from '@types';

import { makeTokenMigrationTxConfig } from '../helpers';
import { TokenMigrationMultiTxConfirmProps } from './TokenMigrationMultiTx';

export default function ConfirmTokenMigration({
  account,
  amount,
  currentTxIdx,
  tokenMigrationConfig,
  transactions,
  onComplete
}: TokenMigrationMultiTxConfirmProps & { account: StoreAccount; amount: string }) {
  const currentTx = transactions[currentTxIdx];

  const complete = () => onComplete && onComplete();

  const txConfig = makeTokenMigrationTxConfig(
    currentTx.txRaw,
    account,
    amount
  )(tokenMigrationConfig);

  return (
    <ConfirmTransaction
      onComplete={complete}
      resetFlow={complete}
      txConfig={txConfig}
      txType={currentTx.type || ITxType.STANDARD}
    />
  );
}
