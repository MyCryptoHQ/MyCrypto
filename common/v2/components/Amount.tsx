import React from 'react';
import { Typography } from '@mycrypto/ui';

import './Amount.scss';

interface Props {
  assetValue: string;
  fiatValue: string;
}

export default function Amount({ assetValue, fiatValue }: Props) {
  return (
    <div className="Amount">
      <Typography className="Amount-asset">{assetValue}</Typography>
      <Typography className="Amount-fiat">{fiatValue}</Typography>
    </div>
  );
}
