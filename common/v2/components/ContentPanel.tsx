import React from 'react';
import { Button, Panel } from '@mycrypto/ui';

import './ContentPanel.scss';

// Legacy
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

interface Props {
  children: any;
  className: string;
  onBack?(): void;
}

export default function ContentPanel({ onBack, children, className = '', ...rest }: Props) {
  return (
    <div className="ContentPanel">
      {onBack && (
        <Button basic={true} className="ContentPanel-back" onClick={onBack}>
          <img src={backArrowIcon} alt="Back arrow" /> Back
        </Button>
      )}
      <Panel className={className} {...rest}>
        {children}
      </Panel>
    </div>
  );
}
