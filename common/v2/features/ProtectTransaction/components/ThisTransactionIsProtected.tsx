import React, { FC } from 'react';
import ProtectIcon from './icons/ProtectIcon';
import feeIcon from 'assets/images/icn-fee.svg';

import './ThisTransactionIsProtected.scss';

export const ThisTransactionIsProtected: FC = () => {
  return (
    <div className="ThisTransactionIsProtected">
      <ProtectIcon size="lg" />
      <h4 className="ThisTransactionIsProtected-title">Your transaction is protected</h4>
      <h5 className="ThisTransactionIsProtected-subtitle">Send your transaction with confidence</h5>
      <hr />
      <div className="ThisTransactionIsProtected-fee">
        <img src={feeIcon} alt="Fee" />
        <p className="fee-label">Protected Transaction Fee:</p>
        <p className="fee-value">
          <span title="0.000426 ETH" className="fee-eth-value">
            0.000426 ETH
          </span>
          <span title="$0.21" className="fee-fiat-value muted">
            $0.21
          </span>
        </p>
      </div>
    </div>
  );
};
