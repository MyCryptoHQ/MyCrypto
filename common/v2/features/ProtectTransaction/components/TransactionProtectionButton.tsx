import React, { FC, useCallback } from 'react';
import ProtectIcon from './icons/ProtectIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

import './TransactionProtectionButton.scss';

interface TransactionProtectionButtonProps {
  disabled: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const TransactionProtectionButton: FC<TransactionProtectionButtonProps> = ({
  onClick: onTransactionProtectionClick,
  disabled
}) => {
  const onClickEvent = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onTransactionProtectionClick(e);
    },
    [onTransactionProtectionClick]
  );

  return (
    <button
      type="button"
      className="TransactionProtectionButton"
      onClick={onClickEvent}
      disabled={disabled}
    >
      <ProtectIcon size="md" />
      <div className="TransactionProtectionButton-text">
        <h6>Get Transaction Protection</h6>
        <p>
          Gain valuable information about the recipient address and the ability to undo your
          transaction within 20 seconds.
        </p>
      </div>
      <ArrowRightIcon />
    </button>
  );
};
