import React from 'react';
import { Amount } from '../../Amount';

export const SummaryAmount: React.SFC<{}> = () => (
  <div className="ConfModal-summary-amount">
    <div className="ConfModal-summary-amount-arrow" />
    <div className="ConfModal-summary-amount-currency">
      <Amount />
    </div>
  </div>
);
