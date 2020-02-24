import React, { FC, useCallback } from 'react';
import ProtectIcon from './icons/ProtectIcon';
import feeIcon from 'assets/images/icn-fee.svg';

import './ProtectionThisTransaction.scss';
import CloseIcon from './icons/CloseIcon';
import { Button } from '@mycrypto/ui';
import { IProtectTransactionProps, ProtectTransactionAction } from '../types';

export const ProtectionThisTransaction: FC<IProtectTransactionProps> = ({
  onProtectTransactionAction
}) => {
  const onProtectMyTransactionClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (onProtectTransactionAction) {
        onProtectTransactionAction({
          actionType: ProtectTransactionAction.PROTECT_MY_TRANSACTION
        });
      }
    },
    []
  );

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (onProtectTransactionAction) {
        onProtectTransactionAction({
          actionType: ProtectTransactionAction.SHOW_HIDE_TRANSACTION_PROTECTION,
          payload: false
        });
      }
    },
    []
  );

  return (
    <div className="ProtectionThisTransaction">
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      <h4 className="ProtectionThisTransaction-title">Protect This Transaction</h4>
      <h5 className="ProtectionThisTransaction-subtitle">
        Send your transaction with confidence by learning about who you're sending to:
      </h5>
      <ul>
        <li>
          <h6>SCAN OUR PARTNER DATABASES</h6>
          <span>We'll let you know if the recipient account is known anywhere.</span>
        </li>
        <li>
          <h6>RECIPIENT’S ACCOUNT BALANCE</h6>
          <span>How much does the account hold?</span>
        </li>
        <li>
          <h6>RECIPIENT’S LATEST TRANSACTION</h6>
          <span>How active is the account?</span>
        </li>
        <li>
          <h6>LINK TO BLOCK EXPLORER COMMENTS</h6>
          <span>If the account is malicious, there will oftentimes be user comments.</span>
        </li>
      </ul>
      <p className="ProtectionThisTransaction-confirm-text">
        Once you confirm and sign the transaction, you'll have 20 seconds to cancel sending if you
        change your mind. Still not convinced? Learn more.
      </p>
      <hr />
      <h4 className="ProtectionThisTransaction-title ProtectionThisTransaction-send-with-confidence">
        Send with Confidence
      </h4>
      <div className="ProtectionThisTransaction-fee">
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
      <Button
        type="button"
        className="ProtectionThisTransaction-protect-transaction"
        onClick={onProtectMyTransactionClick}
      >
        Protect My Transaction
      </Button>
      <button
        type="button"
        className="ProtectionThisTransaction-cancel"
        onClick={onProtectMyTransactionCancelClick}
      >
        I don't want to protect my transaction.
      </button>
    </div>
  );
};
