import React from 'react';

import { MultiTxReceipt } from '@components/TransactionFlow';
import { getFiat } from '@config/fiats';
import { useAssets, useRates, useSettings } from '@services';
import { ITokenMigrationConfig, StoreAccount, TxParcel } from '@types';
import { makeTxItem } from '@utils/transaction';

import { makeTokenMigrationTxConfig } from '../helpers';

export interface TokenMigrationReceiptProps {
  account: StoreAccount;
  amount: string;
  transactions: TxParcel[];
  flowConfig: ITokenMigrationConfig;
  onComplete(): void;
}

export default function TokenMigrationReceipt({
  account,
  amount,
  transactions,
  flowConfig,
  onComplete
}: TokenMigrationReceiptProps) {
  const { settings } = useSettings();
  const { getAssetByUUID } = useAssets();
  const { getAssetRate } = useRates();
  const txItems = transactions.map((tx, idx) => {
    const txConfig = makeTokenMigrationTxConfig(tx.txRaw, account, amount)(flowConfig);
    const txType = flowConfig.txConstructionConfigs[idx].txType;
    return makeTxItem(txType, txConfig, tx.txHash!, tx.txReceipt);
  });

  const baseAsset = getAssetByUUID(txItems[0].txConfig.network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);
  const lastTxConfig =
    flowConfig.txConstructionConfigs[
    flowConfig.txConstructionConfigs.length - 1
  ];
  return (
    <MultiTxReceipt
      txType={lastTxConfig.txType}
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
