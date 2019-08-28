import React from 'react';
import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

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
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'OmiseGO2',
    value: '$3,037.95'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'OmiseGO3',
    value: '$3,037.95'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'OmiseGO4',
    value: '$3,037.95'
  }
];

const TokenListWrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Token = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`;

const Asset = styled.div`
  display: flex;
  align-items: center;
`;

const AssetName = styled(Typography)`
  margin: 0 0 0 15px !important;
  font-weight: normal;
  font-size: 14px;
`;

const TokenValueWrapper = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`;

const TokenValue = styled(Typography)`
  margin: 0 15px 0 0 !important;
  font-weight: normal;
  font-size: 16px;
`;

export function TokenList() {
  return (
    <TokenListWrapper>
      {tokens.map(({ image, name, value }) => (
        <Token key={name}>
          <Asset>
            <img src={image} alt={name} />
            <AssetName>{name}</AssetName>
          </Asset>
          <TokenValueWrapper>
            <TokenValue>{value}</TokenValue>
            <img src={moreIcon} alt="More" />
          </TokenValueWrapper>
        </Token>
      ))}
    </TokenListWrapper>
  );
}
