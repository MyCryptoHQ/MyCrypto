import React, { useContext } from 'react';

import { TxReceipt, MultiTxReceipt } from '@components/TransactionFlow';
import { ITxType, TxParcel, StoreAccount } from '@types';
import { makeTxItem } from '@utils/transaction';
import { RatesContext, AssetContext, SettingsContext } from '@services';
import { getFiat } from '@config/fiats';

import { IMembershipConfig } from '../config';
import { makePurchaseMembershipTxConfig } from '../helpers';

interface Props {
  account: StoreAccount;
  transactions: TxParcel[];
  membershipSelected: IMembershipConfig;
  onComplete(): void;
}

export default function MembershipReceipt({
  account,
  transactions,
  membershipSelected,
  onComplete
}: Props) {
  const { getAssetByUUID } = useContext(AssetContext);
  const { settings } = useContext(SettingsContext);
  const { getAssetRate } = useContext(RatesContext);

  const txItems = transactions.map((tx, idx) => {
    const txConfig = makePurchaseMembershipTxConfig(tx.txRaw, account, membershipSelected);
    const txType = idx === transactions.length - 1 ? ITxType.PURCHASE_MEMBERSHIP : ITxType.APPROVAL;
    return makeTxItem(txType, txConfig, tx.txResponse, tx.txReceipt);
  });

  const baseAsset = getAssetByUUID(txItems[0].txConfig.network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const fiat = getFiat(settings);

  return txItems.length === 1 ? (
    <TxReceipt
      txReceipt={txItems.map(({ txReceipt }) => txReceipt)[0]}
      txConfig={txItems.map(({ txConfig }) => txConfig)[0]}
      membershipSelected={membershipSelected}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  ) : (
    <MultiTxReceipt
      txType={ITxType.PURCHASE_MEMBERSHIP}
      membershipSelected={membershipSelected}
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
