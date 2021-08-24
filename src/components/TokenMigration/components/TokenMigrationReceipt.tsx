import { MultiTxReceipt } from '@components/TransactionFlow';
import { getFiat } from '@config/fiats';
import { makeTxConfigFromTx, makeTxItem } from '@helpers';
import { useAssets, useNetworks, useRates, useSettings } from '@services';
import { ITokenMigrationConfig, ITxType, StoreAccount, TxParcel } from '@types';

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
  const { getAssetByUUID, assets } = useAssets();
  const { getAssetRate } = useRates();
  const { getNetworkById } = useNetworks();
  const txItems = transactions.map((tx, idx) => {
    const txType = flowConfig.txConstructionConfigs[idx].txType;
    const txConfig =
      txType === ITxType.APPROVAL
        ? makeTxConfigFromTx(tx.txRaw, assets, account.network, [account])
        : makeTokenMigrationTxConfig(tx.txRaw, account, amount)(flowConfig);
    return makeTxItem(txType, txConfig, tx.txHash!, tx.txReceipt);
  });

  const network = getNetworkById(txItems[0].txConfig.networkId);

  const baseAsset = getAssetByUUID(network.baseAsset)!;

  const baseAssetRate = getAssetRate(baseAsset);

  const steps = flowConfig.txConstructionConfigs.map((txConstructionConfig) => ({
    title: txConstructionConfig.stepTitle,
    icon: txConstructionConfig.stepSvg
  }));

  const fiat = getFiat(settings);
  const lastTxConfig =
    flowConfig.txConstructionConfigs[flowConfig.txConstructionConfigs.length - 1];
  return (
    <MultiTxReceipt
      txType={lastTxConfig.txType}
      transactions={transactions}
      transactionsConfigs={txItems.map(({ txConfig }) => txConfig)}
      steps={steps}
      account={account}
      network={account.network}
      baseAssetRate={baseAssetRate}
      fiat={fiat}
      resetFlow={onComplete}
      onComplete={onComplete}
    />
  );
}
