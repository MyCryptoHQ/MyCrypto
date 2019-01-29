import React from 'react';
import { Link } from 'react-router-dom';
import { Address, Button, Copyable } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import { Transaction } from '../SendAssets';
import './TransactionComplete.scss';

// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';

interface Props {
  transaction: Transaction;
  onReset(): void;
}

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function TransactionComplete({
  transaction: { recipientAddress, senderAddress },
  onReset
}: Props) {
  return (
    <div className="TransactionComplete">
      <div className="TransactionComplete-row">
        <div className="TransactionComplete-row-column">
          To:
          <div className="TransactionComplete-addressWrapper">
            <Address address={recipientAddress} title="Example #2" truncate={truncate} />
          </div>
        </div>
        <div className="TransactionComplete-row-column">
          From:
          <div className="TransactionComplete-addressWrapper">
            <Address address={senderAddress} title="Example #1" truncate={truncate} />
          </div>
        </div>
      </div>
      <div className="TransactionComplete-row">
        <div className="TransactionComplete-row-column">
          <img src={sentIcon} alt="Sent" /> You Sent:
        </div>
        <div className="TransactionComplete-row-column">
          <Amount assetValue="13.2343 ETH" fiatValue="$12,000.00" />
        </div>
      </div>
      <div className="TransactionComplete-divider" />
      <div className="TransactionComplete-details">
        <div className="TransactionComplete-details-row">
          <div className="TransactionComplete-details-row-column">Transaction ID:</div>
          <div className="TransactionComplete-details-row-column">
            <Copyable text="0xf6536u38u4i3i3i6afe7" truncate={truncate} />
          </div>
        </div>
        <div className="TransactionComplete-details-row">
          <div className="TransactionComplete-details-row-column">Receipt Status:</div>
          <div className="TransactionComplete-details-row-column">Success</div>
        </div>
        <div className="TransactionComplete-details-row">
          <div className="TransactionComplete-details-row-column">Timestamp:</div>
          <div className="TransactionComplete-details-row-column">
            1 minute ago <br />
            (Dec-30-2018 03:17:10 AM +UTC)
          </div>
        </div>
      </div>
      <Link to="/dashboard">
        <Button className="TransactionComplete-back">Back to Dashboard</Button>
      </Link>
      <Button secondary={true} onClick={onReset} className="TransactionComplete-another">
        Send Another Transaction
      </Button>
    </div>
  );
}
