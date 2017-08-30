import React from 'react';
import bityConfig from 'config/bity';
import translate from 'translations';
export type TransactionSucceededProps = {
  txHash: any
};

const TransactionSucceeded = ({ txHash }: TransactionSucceededProps) => {
  const checkTxLink = `https://www.myetherwallet.com?txHash=${txHash}/#check-tx-status`;
  const txHashLink = bityConfig.ethExplorer.replace('[[txHash]]', txHash);

  return (
    <div>
      <p>
        {translate('SUCCESS_3', true) + txHash}
      </p>
      <button
        className="btn btn-xs btn-info string"
        href={txHashLink}
        target="_blank"
        rel="noopener"
      >
        Verify Transaction
      </button>
    </div>
  );
};

export default TransactionSucceeded;
