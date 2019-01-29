import React, { Component } from 'react';
import { Address, Button, Copyable, Network } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import { Transaction } from '../SendAssets';
import './TransactionComplete.scss';

// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';

interface Props {
  transaction: Transaction;
  onNext(): void;
}

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function TransactionComplete({
  transaction: { recipientAddress, senderAddress }
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
      <Button className="TransactionComplete-back">Back to Dashboard</Button>
      <Button secondary={true} className="TransactionComplete-another">
        Send Another Transaction
      </Button>
    </div>
  );
}
