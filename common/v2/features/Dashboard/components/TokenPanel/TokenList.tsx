import React from 'react';
import { Typography } from '@mycrypto/ui';

import './TokenList.scss';

// Legacy
import moreIcon from 'common/assets/images/icn-more.svg';

// Fake Data
const tokens = [
  {
    image: 'https://placehold.it/30x30',
    name: 'Stack',
    value: '$3,037.95'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'OmiseGO',
    value: '$3,037.95'
  }
];

export function TokenList() {
  return (
    <div className="TokenList-tokens">
      {tokens.map(({ image, name, value }) => (
        <div key={name} className="TokenList-tokens-token">
          <div className="TokenList-tokens-token-asset">
            <img src={image} alt={name} />
            <Typography className="TokenList-tokens-token-asset-name">{name}</Typography>
          </div>
          <div className="TokenList-tokens-token-value">
            <Typography className="TokenList-tokens-token-value-amount">{value}</Typography>
            <img src={moreIcon} alt="More" />
          </div>
        </div>
      ))}
    </div>
  );
}
