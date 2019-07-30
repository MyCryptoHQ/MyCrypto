import React from 'react';

import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';
import { ISignComponentProps } from '../../types';
import './SafeTmini.scss';

export default function SignTransactionSafeT({  }: ISignComponentProps) {
  return (
    <div className="SignTransaction-panel">
      <div className="SignTransactionSafeT-title">Sign the Transaction with your Safe-T Mini</div>
      <div className="SignTransactionSafeT-instructions">
        Connect your Safe-T Mini to your computer and enter your Safe-T Mini PIN when prompted to
        sign your transaction.
      </div>
      <div className="SignTransactionSafeT-content">
        <div className="SignTransactionSafeT-img">
          <img src={SafeTIcon} />
        </div>
        <div className="SignTransactionSafeT-description">
          Because we never save, store, or transmit your secret, you need to sign each transaction
          in order to send it. MyCrypto puts YOU in control of your assets.
        </div>
        <div className="SignTransactionSafeT-footer">
          <div className="SignTransactionSafeT-help">
            Not working? Here's some troubleshooting tips to try.
          </div>
        </div>
      </div>
    </div>
  );
}
