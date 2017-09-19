import React from 'react';
import { ETHTxExplorer } from 'config/data';
import translate from 'translations';
export type TransactionSucceededProps = {
  txHash: string
};

const TransactionSucceeded = ({ txHash }: TransactionSucceededProps) => {
  // const checkTxLink = `https://www.myetherwallet.com?txHash=${txHash}/#check-tx-status`;
  const txHashLink = ETHTxExplorer(txHash);

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
