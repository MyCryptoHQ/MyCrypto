import React from 'react';
import { From } from '../../From';
import { Identicon } from 'components/ui';

export const SummaryFrom: React.SFC<{}> = () => (
  <div className="ConfModal-summary-icon ConfModal-summary-icon--from">
    <From withFrom={from => <Identicon size="100%" address={from} />} />
  </div>
);
