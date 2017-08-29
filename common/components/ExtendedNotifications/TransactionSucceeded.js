import React from 'react';
import bityConfig from 'config/bity';

export type TransactionSucceededProps = {
  txHash: any
};

const TransactionSucceeded = ({ txHash }: TransactionSucceededProps) => {
  const checkTxLink = `https://www.myetherwallet.com?txHash=${txHash}/#check-tx-status`;
  const txHashLink = bityConfig.ethExplorer.replace('[[txHash]]', txHash);

  return (
    <div>
      <p>
        Your TX has been broadcast to the network. It is waiting to be mined &
        confirmed. During ICOs, it may take 3+ hours to confirm. Use the Verify
        & Check buttons below to see. TX Hash: {txHash}
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
