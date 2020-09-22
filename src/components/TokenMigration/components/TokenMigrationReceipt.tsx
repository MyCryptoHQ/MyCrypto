import React from 'react';

import { MultiTxReceipt } from '@components/TransactionFlow';
import { getFiat } from '@config/fiats';
import { useAssets, useRates, useSettings } from '@services';
import { ITokenMigrationConfig, ITxType, StoreAccount, TxParcel } from '@types';
import { makeTxItem } from '@utils/transaction';

import { makeTokenMigrationTxConfig } from '../helpers';

interface Props {
  account: StoreAccount;
  transactions: TxParcel[];
  tokenMigrationConfig: ITokenMigrationConfig;
  onComplete(): void;
}

export default function TokenMigrationReceipt({
  account,
  transactions,
  tokenMigrationConfig,
  onComplete
}: Props) {
  const { settings } = useSettings();
  const { getAssetByUUID } = useAssets();
  const { getAssetRate } = useRates();
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeTokenMigrationTxConfig(tx.txRaw, account)(tokenMigrationConfig);
    // @todo: handle non-rep migration
    const txType = idx === transactions.length - 1 ? ITxType.REP_TOKEN_MIGRATION : ITxType.APPROVAL;
    return makeTxItem(txType, txConfig, tx.txHash!, tx.txReceipt);
  });

  const baseAsset = getAssetByUUID(txItems[0].txConfig.network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);

  return (
    <MultiTxReceipt
      txType={ITxType.REP_TOKEN_MIGRATION} // @todo: handle non-rep migration
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      account={account}
      network={account.network}
      baseAssetRate={baseAssetRate}
      fiat={fiat}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}