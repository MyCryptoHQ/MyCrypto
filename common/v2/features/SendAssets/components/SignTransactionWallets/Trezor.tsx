import React from 'react';
import ConnectTrezor from 'common/assets/images/icn-connect-trezor-new.svg';
import './Trezor.scss';

export default function SignTransactionTrezor() {
  return (
    <div className="SignTransaction-panel">
      <div className="SignTransactionTrezor-title">Sign the Transaction with your Trezor</div>
      <div className="SignTransactionTrezor-instructions">
        Connect your Trezor to your computer and enter your Trezor PIN when prompted to sign your
        transaction.
      </div>
      <div className="SignTransactionTrezor-content">
        <div className="SignTransactionTrezor-img">
          <img src={ConnectTrezor} />
        </div>
        <div className="SignTransactionTrezor-description">
          Because we never save, store, or transmit your secret, you need to sign each transaction
          in order to send it. MyCrypto puts YOU in control of your assets.
        </div>
        <div className="SignTransactionTrezor-footer">
          <div className="SignTransactionTrezor-help">
            Not working? Here's some troubleshooting tips to try.
          </div>
          <div className="SignTransactionTrezor-referal">Need a Trezor? Get one now.</div>
        </div>
      </div>
    </div>
  );
}
