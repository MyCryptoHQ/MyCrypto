import React from 'react';
import { Link } from 'react-router-dom';

import { etherChainExplorerInst } from 'config/data';
import translate from 'translations';
import { BlockExplorerConfig } from 'types/network';
import { getAwaitingMiningURL } from 'libs/scheduling';
import { NewTabLink } from 'components/ui';

export interface TransactionSucceededProps {
  txHash: string;
  blockExplorer?: BlockExplorerConfig;
  scheduling?: boolean;
}

const TransactionSucceeded = ({ txHash, blockExplorer, scheduling }: TransactionSucceededProps) => {
  let verifyBtn: React.ReactElement<string> | undefined;
  let altVerifyBtn: React.ReactElement<string> | undefined;
  if (blockExplorer) {
    verifyBtn = (
      <NewTabLink className="btn btn-xs" href={blockExplorer.txUrl(txHash)}>
        {translate('VERIFY_TX', { $block_explorer: blockExplorer.name })}
      </NewTabLink>
    );
  }
  // TODO: In the future, we'll want to refactor staticNetworks so that multiple blockexplorers can be configured per network.
  // This requires a large refactor, so for now we'll hard-code the etherchain link when etherscan is shown to verify your transaction
  if (blockExplorer && blockExplorer.origin === 'https://etherscan.io') {
    altVerifyBtn = (
      <NewTabLink className="btn btn-xs" href={etherChainExplorerInst.txUrl(txHash)}>
        {translate('VERIFY_TX', { $block_explorer: etherChainExplorerInst.name })}
      </NewTabLink>
    );
  }

  let scheduleDetailsBtn: React.ReactElement<string> | undefined;
  if (scheduling) {
    scheduleDetailsBtn = (
      <NewTabLink className="btn btn-xs" href={getAwaitingMiningURL(txHash)}>
        {translate('SCHEDULE_CHECK')}
      </NewTabLink>
    );
  }

  return (
    <div>
      <p>
        {translate('SUCCESS_3')} {txHash}
      </p>
      {scheduleDetailsBtn}
      {verifyBtn}
      {altVerifyBtn}
      <Link to={`/tx-status?txHash=${txHash}`} className="btn btn-xs">
        {translate('NAV_CHECKTXSTATUS')}
      </Link>
    </div>
  );
};

export default TransactionSucceeded;
