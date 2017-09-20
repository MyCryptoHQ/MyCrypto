import React from 'react';
import type { BlockExplorerConfig } from 'config.data';
import translate from 'translations';

export type TransactionSucceededProps = {
  txHash: string,
  blockExplorer: BlockExplorerConfig
};

const TransactionSucceeded = ({
  txHash,
  blockExplorer
}: TransactionSucceededProps) => {
  // const checkTxLink = `https://www.myetherwallet.com?txHash=${txHash}/#check-tx-status`;
  const txHashLink = blockExplorer.tx(txHash);

  return (
    <div>
      <p>
        {translate('SUCCESS_3', true) + txHash}
      </p>
      <a
        className="btn btn-xs btn-info string"
        href={txHashLink}
        target="_blank"
        rel="noopener"
      >
        Verify Transaction
      </a>
    </div>
  );
};

export default TransactionSucceeded;
