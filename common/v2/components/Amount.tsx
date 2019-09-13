import React from 'react';
import { Typography } from '@mycrypto/ui';

import './Amount.scss';

interface Props {
  assetValue: string;
  fiatValue: string;
  baseAssetValue?: string;
}

export default function Amount({ assetValue, fiatValue, baseAssetValue }: Props) {
  return (
    <div className="Amount">
      <Typography className="Amount-asset">{assetValue}</Typography>
      {baseAssetValue && <Typography className="Amount-baseAsset">{baseAssetValue}</Typography>}
      <Typography className="Amount-fiat">{fiatValue}</Typography>
    </div>
  );
}
