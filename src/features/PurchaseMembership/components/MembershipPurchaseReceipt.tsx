import React from 'react';

import { MultiTxReceipt, TxReceipt } from '@components/TransactionFlow';
import { getFiat } from '@config/fiats';
import { useAssets, useRates, useSettings } from '@services';
import { ITxType, StoreAccount, TxParcel } from '@types';
import { makeTxItem } from '@utils/transaction';

import { IMembershipConfig } from '../config';
import { makePurchaseMembershipTxConfig } from '../helpers';

export interface IMembershipPurchaseReceiptProps {
  account: StoreAccount;
  transactions: TxParcel[];
  flowConfig: IMembershipConfig;
  onComplete(): void;
}

export default function MembershipReceipt({
  account,
  transactions,
  flowConfig,
  onComplete
}: IMembershipPurchaseReceiptProps) {
  const { getAssetByUUID } = useAssets();
  const { settings } = useSettings();
  const { getAssetRate } = useRates();

  const txItems = transactions.map((tx, idx) => {
    const txConfig = makePurchaseMembershipTxConfig(tx.txRaw, account, flowConfig);
    const txType = idx === transactions.length - 1 ? ITxType.PURCHASE_MEMBERSHIP : ITxType.APPROVAL;
    return makeTxItem(txType, txConfig, tx.txHash!, tx.txReceipt);
  });

  const baseAsset = getAssetByUUID(txItems[0].txConfig.network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);

  return txItems.length === 1 ? (
    <TxReceipt
      txReceipt={txItems.map(({ txReceipt }) => txReceipt)[0]}
      txConfig={txItems.map(({ txConfig }) => txConfig)[0]}
      membershipSelected={flowConfig}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={flowConfig}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      account={account}
      network={account.network}
      resetFlow={onComplete}
      onComplete={onComplete}
      fiat={fiat}
      baseAssetRate={baseAssetRate}
    />
  );
}
