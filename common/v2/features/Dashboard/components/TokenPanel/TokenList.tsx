import React from 'react';
import { Typography, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { convertToFiat } from 'v2/utils';
import { AssetWithDetails, TSymbol } from 'v2/types';
import { AssetIcon, DashboardPanel, Spinner } from 'v2/components';
import { translateRaw } from 'translations';
import { BREAK_POINTS } from 'v2/theme';

import moreIcon from 'common/assets/images/icn-more.svg';

const { SCREEN_XS, SCREEN_SM, SCREEN_LG } = BREAK_POINTS;

const TokenListWrapper = styled.div`
  max-height: 313px;
  overflow-y: auto;
`;

const Token = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-right: 8px;
`;

const Asset = styled.div`
  display: flex;
  align-items: center;
  width: 65%;
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

const MoreIcon = styled.img`
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  padding: 9px 16px;
  font-size: 18px;
  margin-left: 8px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

const ButtonsGroup = styled.div`
  @media (min-width: ${SCREEN_SM}) and (max-width: ${SCREEN_LG}), (max-width: ${SCREEN_XS}) {
    display: none;
  }
`;

const MobileButtonsGroup = styled.div`
  display: none;

  @media (min-width: ${SCREEN_SM}) and (max-width: ${SCREEN_LG}), (max-width: ${SCREEN_XS}) {
    display: block;
  }
`;

interface TokenListProps {
  isScanning: boolean;
  tokens: AssetWithDetails[];
  setShowDetailsView(show: boolean): void;
  setShowAddToken(setShowAddToken: boolean): void;
  setCurrentToken(token: AssetWithDetails): void;
  handleScanTokens(): Promise<void>;
}

export function TokenList(props: TokenListProps) {
  const {
    setShowDetailsView,
    setCurrentToken,
    tokens,
    isScanning,
    setShowAddToken,
    handleScanTokens
  } = props;
  return (
    <DashboardPanel
      heading={translateRaw('TOKENS')}
      headingRight={
        <>
          <ButtonsGroup>
            <StyledButton onClick={() => handleScanTokens()}>
              {translateRaw('SCAN_TOKENS')}
            </StyledButton>
            <StyledButton onClick={() => setShowAddToken(true)}>
              + {translateRaw('ADD_TOKEN')}
            </StyledButton>
          </ButtonsGroup>
          <MobileButtonsGroup>
            <StyledButton onClick={() => handleScanTokens()}>
              {translateRaw('SCAN_TOKENS_SHORT')}
            </StyledButton>
            <StyledButton onClick={() => setShowAddToken(true)}>
              + {translateRaw('ADD_TOKEN_SHORT')}
            </StyledButton>
          </MobileButtonsGroup>
        </>
      }
      padChildren={true}
    >
      {isScanning ? (
        <SpinnerWrapper>
          <Spinner size="x3" />
        </SpinnerWrapper>
      ) : (
        <TokenListWrapper>
          {tokens.map(token => (
            <Token key={token.name}>
              <Asset>
                <AssetIcon symbol={token.ticker as TSymbol} size={'26px'} />
                <AssetName>{token.name}</AssetName>
              </Asset>
              <TokenValueWrapper>
                <TokenValue>${convertToFiat(token.balance, token.rate).toFixed(2)}</TokenValue>
                <MoreIcon
                  src={moreIcon}
                  alt="More"
                  onClick={() => {
                    setShowDetailsView(true);
                    setCurrentToken(token);
                  }}
                />
              </TokenValueWrapper>
            </Token>
          ))}
        </TokenListWrapper>
      )}
    </DashboardPanel>
  );
}
