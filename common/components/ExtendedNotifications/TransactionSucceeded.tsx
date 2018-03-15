import React from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { NewTabLink } from 'components/ui';
import { BlockExplorerConfig } from 'types/network';

export interface TransactionSucceededProps {
  txHash: string;
  blockExplorer?: BlockExplorerConfig;
}

const TransactionSucceeded = ({ txHash, blockExplorer }: TransactionSucceededProps) => {
  let verifyBtn: React.ReactElement<string> | undefined;
  if (blockExplorer) {
    verifyBtn = (
      <NewTabLink className="btn btn-xs" href={blockExplorer.txUrl(txHash)}>
        {translate('VERIFY_TX', { $block_explorer: blockExplorer.name })}
      </NewTabLink>
    );
  }

  return (
    <div>
      <p>
        {translate('SUCCESS_3')} {txHash}
      </p>
      {verifyBtn}
      <Link to={`/tx-status?txHash=${txHash}`} className="btn btn-xs">
        {translate('NAV_CheckTxStatus')}
      </Link>
    </div>
  );
};

export default TransactionSucceeded;
