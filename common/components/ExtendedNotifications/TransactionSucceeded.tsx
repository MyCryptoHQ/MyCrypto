import React from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { NewTabLink } from 'components/ui';
import { BlockExplorerConfig } from 'types/network';
import { getTXDetailsCheckURL } from 'libs/scheduling';

export interface TransactionSucceededProps {
  txHash: string;
  blockExplorer?: BlockExplorerConfig;
  scheduling?: boolean;
}

const TransactionSucceeded = ({ txHash, blockExplorer, scheduling }: TransactionSucceededProps) => {
  let verifyBtn: React.ReactElement<string> | undefined;
  if (blockExplorer) {
    verifyBtn = (
      <NewTabLink className="btn btn-xs" href={blockExplorer.txUrl(txHash)}>
        {translate('VERIFY_TX', { $block_explorer: blockExplorer.name })}
      </NewTabLink>
    );
  }

  let scheduleDetailsBtn: React.ReactElement<string> | undefined;
  if (scheduling) {
    scheduleDetailsBtn = (
      <a href={getTXDetailsCheckURL(txHash)} className="btn btn-xs">
        {translate('SCHEDULE_check')}
      </a>
    );
  }

  return (
    <div>
      <p>
        {translate('SUCCESS_3')} {txHash}
      </p>
      {scheduleDetailsBtn}
      {verifyBtn}
      <Link to={`/tx-status?txHash=${txHash}`} className="btn btn-xs">
        {translate('NAV_CHECKTXSTATUS')}
      </Link>
    </div>
  );
};

export default TransactionSucceeded;
