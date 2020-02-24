import React, { FC } from 'react';
import ProtectIcon from './icons/ProtectIcon';
import wizardIcon from 'assets/images/icn-protect-transcation-wizard.svg';

import './ProtectedTransactionReport.scss';

export const ProtectedTransactionReport: FC = () => {
  return (
    <div className="ProtectedTransactionReport">
      <ProtectIcon size="lg" />
      <h4 className="ProtectedTransactionReport-title">Your Report for Address</h4>
      <h4 className="ProtectedTransactionReport-title ProtectedTransactionReport-title-address">
        0x423b...a93a
      </h4>
      <h5 className="ProtectedTransactionReport-subtitle">
        If any of the information below is unexpected, please stop and review the address. Where did
        you copy the address from? Who gave you the address?
      </h5>
      <div className="ProtectedTransactionReport-timeline">
        <ul className="timeline">
          <li>
            <div className="timeline-badge">1</div>
            <div className="timeline-panel">
              <h6>KNOWN ACCOUNT:</h6>
              <p className="text-success">Compound v1</p>
              <p className="text-success">
                CryptScamDB reports that this is the Compound smart contract.
              </p>
            </div>
          </li>
          <li>
            <div className="timeline-badge">2</div>
            <div className="timeline-panel">
              <h6>Recipient Account Balance:</h6>
              <p className="text-muted">1.00 ETH</p>
            </div>
          </li>
          <li>
            <div className="timeline-badge">3</div>
            <div className="timeline-panel">
              <h6>Recipient Account Activity:</h6>
              <h6>Last Sent ETH:</h6>
              <p className="text-muted">1.01 ETH on 12/24/2019</p>
              <h6>Last Sent Token:</h6>
              <p className="text-muted">0.2 NEC on 12/30/2019</p>
            </div>
          </li>
        </ul>
      </div>
      <p className="ProtectedTransactionReport-view-comments">
        View comments for this account on Etherscan.
      </p>
      <p className="ProtectedTransactionReport-footer-text">
        If everything looks good, click "Next" on the left to see a preview of your main
        transaction. Upon confirming and sending the transaction, you'll get{' '}
        <span className="highlighted">20 seconds</span> to cancel if you change your mind.
      </p>
      <img src={wizardIcon} alt="Wizard" />
    </div>
  );
};
