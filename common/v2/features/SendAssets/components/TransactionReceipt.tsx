import React from 'react';
import { Link } from 'react-router-dom';
import { Address, Button, Copyable } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import { IStepComponentProps, ITxData } from '../types';
import './TransactionReceipt.scss';

// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';
import { fromTxReceiptObj } from '../helpers';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function TransactionReceipt({ txReceipt }: IStepComponentProps) {
  if (!txReceipt) {
    return <div>Tx Receipt could not be found.</div>;
  }
  const timestamp = txReceipt.blockNumber;

  const txDecoded: ITxData | undefined = fromTxReceiptObj(txReceipt);
  if (!txDecoded) {
    return <div>Tx Receipt could not be decoded.</div>;
  }
  return (
    <div className="TransactionReceipt">
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          To:
          <div className="TransactionReceipt-addressWrapper">
            <Address address={txDecoded.to} title="Example #2" truncate={truncate} />
          </div>
        </div>
        <div className="TransactionReceipt-row-column">
          From:
          <div className="TransactionReceipt-addressWrapper">
            <Address address={txDecoded.from} title="Example #1" truncate={truncate} />
          </div>
        </div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={sentIcon} alt="Sent" /> You Sent:
        </div>
        <div className="TransactionReceipt-row-column">
          <Amount
            assetValue={`${txDecoded.amount} ${txDecoded.asset ? txDecoded.asset.ticker : 'ETH'}`}
            fiatValue="$250"
          />
        </div>
      </div>
      <div className="TransactionReceipt-divider" />
      <div className="TransactionReceipt-details">
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Transaction ID:</div>
          <div className="TransactionReceipt-details-row-column">
            <Copyable text={txDecoded.hash} truncate={truncate} />
          </div>
        </div>
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Receipt Status:</div>
          <div className="TransactionReceipt-details-row-column">Success</div>
        </div>
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Timestamp:</div>
          <div className="TransactionReceipt-details-row-column">
            1 minute ago <br />({timestamp})
          </div>
        </div>
      </div>
      <Link to="/dashboard">
        <Button className="TransactionReceipt-back">Back to Dashboard</Button>
      </Link>
      <Button secondary={true} className="TransactionReceipt-another">
        Send Another Transaction
      </Button>
    </div>
  );
}
