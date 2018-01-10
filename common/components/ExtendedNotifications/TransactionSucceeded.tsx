import { BlockExplorerConfig } from 'config/data';
import React from 'react';
import { translateRaw } from 'translations';

export interface TransactionSucceededProps {
  txHash: string;
  blockExplorer: BlockExplorerConfig;
}

const TransactionSucceeded = ({ txHash, blockExplorer }: TransactionSucceededProps) => {
  // const checkTxLink = `https://www.myetherwallet.com?txHash=${txHash}/#check-tx-status`;
  const txHashLink = blockExplorer.tx(txHash);

  return (
    <div>
      <p>{translateRaw('SUCCESS_3') + txHash}</p>
      <a
        className="btn btn-xs btn-info string"
        href={txHashLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Verify Transaction
      </a>
    </div>
  );
};

export default TransactionSucceeded;
