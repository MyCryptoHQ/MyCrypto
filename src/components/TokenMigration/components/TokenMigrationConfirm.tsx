import React, { useContext } from 'react';

import { ConfirmTransaction } from '@components';
import { StoreContext, useAssets, useNetworks } from '@services';
import { ITxType } from '@types';
import { makeTxConfigFromRawTx } from '@utils/transaction';

import { TokenMigrationMultiTxConfirmProps } from './TokenMigrationMultiTx';

export default function ConfirmTokenMigration({
  currentTxIdx,
  transactions,
  onComplete
}: TokenMigrationMultiTxConfirmProps) {
  const { getNetworkByChainId } = useNetworks();
  const { accounts } = useContext(StoreContext);
  const { assets } = useAssets();
  const currentTx = transactions[currentTxIdx];

  const complete = () => onComplete && onComplete();

  const network = getNetworkByChainId(currentTx.txRaw.chainId)!;

  const txConfig = makeTxConfigFromRawTx(currentTx.txRaw, network, accounts, assets);

  return (
    <ConfirmTransaction
      onComplete={complete}
      resetFlow={complete}
      txConfig={txConfig}
      txType={currentTx.type || ITxType.STANDARD}
    />
  );
}
