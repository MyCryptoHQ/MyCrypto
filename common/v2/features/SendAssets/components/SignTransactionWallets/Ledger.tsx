import React from 'react';

import { ISignComponentProps } from '../../types';
import './Ledger.scss';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';

export default function SignTransactionLedger({  }: ISignComponentProps) {
  return (
    <div className="SignTransaction-panel">
      <div className="SignTransactionLedger-title">Sign the Transaction with your Ledger</div>
      <div className="SignTransactionLedger-instructions">
        Connect your Ledger to your computer and select the Network application to sign your
        transaction.
      </div>
      <div className="SignTransactionLedger-content">
        <div className="SignTransactionLedger-img">
          <img src={ledgerIcon} />
        </div>
        <div className="SignTransactionLegder-description">
          Because we never save, store, or transmit your secret, you need to sign each transaction
          in order to send it. MyCrypto puts YOU in control of your assets.
        </div>
        <div className="SignTransactionLedger-footer">
          <div className="SignTransactionLedger-help">
            Not working? Here's some troubleshooting tips to try.
          </div>
          <div className="SignTransactionLedger-referal">Need a Ledger? Get one now.</div>
        </div>
      </div>
    </div>
  );
}
