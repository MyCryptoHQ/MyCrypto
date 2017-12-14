import { SummaryAmount, SummaryFrom, SummaryTo } from './components';
import React from 'react';

export const Summary: React.SFC<{}> = () => (
  <div className="ConfModal-summary">
    <SummaryFrom />
    <SummaryAmount />
    <SummaryTo />
  </div>
);
