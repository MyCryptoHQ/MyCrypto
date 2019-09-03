import React, { useState } from 'react';
import styled from 'styled-components';

import { DashboardPanel } from 'v2/components';
import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';

import backArrowIcon from 'common/assets/images/icn-back.svg';
import expandIcon from 'common/assets/images/icn-expand.svg';
import { Button } from '@mycrypto/ui';
import { translateRaw } from 'translations';

const Icon = styled.img`
  cursor: pointer;
`;

const BackIcon = styled(Icon)`
  margin-right: 16px;
`;

const StyledButton = styled(Button)`
  padding: 9px 16px;
  font-size: 18px;
`;

// Mock Data
const tokens = [
  {
    image: 'https://placehold.it/30x30',
    name: 'Stack',
    value: '$3,037.95',
    ticker: 'STK'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'OmiseGO',
    value: '$3,037.95',
    ticker: 'OMG'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'Goerli',
    value: '$3.33',
    ticker: 'GRL'
  },
  {
    image: 'https://placehold.it/30x30',
    name: 'Ethereum',
    value: '$186.99',
    ticker: 'ETH'
  }
];

export function TokenPanel() {
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState();

  const TokenListPanel = () => {
    return (
      <DashboardPanel
        heading="Tokens"
        headingRight={
          <StyledButton onClick={() => setShowAddToken(true)}>
            + {translateRaw('ADD_TOKEN')}
          </StyledButton>
        }
        padChildren={true}
      >
        <TokenList
          tokens={tokens}
          setShowDetailsView={setShowDetailsView}
          setCurrentToken={setCurrentToken}
        />
      </DashboardPanel>
    );
  };

  const DetailsPanel = () => {
    return (
      <DashboardPanel
        heading={
          <div>
            <BackIcon src={backArrowIcon} onClick={() => setShowDetailsView(false)} />
            {currentToken.name}
          </div>
        }
        headingRight={<Icon src={expandIcon} />}
        padChildren={true}
      >
        <TokenDetails />
      </DashboardPanel>
    );
  };

  const AddTokenPanel = () => {
    return (
      <DashboardPanel
        heading={
          <div>
            <BackIcon
              src={backArrowIcon}
              onClick={() => {
                setShowDetailsView(false);
                setShowAddToken(false);
              }}
            />
            {translateRaw('ADD_CUSTOM_TOKEN')}
          </div>
        }
        padChildren={true}
      >
        <AddToken />
      </DashboardPanel>
    );
  };

  return showDetailsView ? <DetailsPanel /> : showAddToken ? <AddTokenPanel /> : <TokenListPanel />;
}
