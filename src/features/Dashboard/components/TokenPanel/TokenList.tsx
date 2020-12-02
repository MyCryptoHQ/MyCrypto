import React from 'react';

import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  AssetIcon,
  Body,
  DashboardPanel,
  Heading,
  Icon,
  RouterLink,
  Spinner,
  Tooltip
} from '@components';
import { ROUTE_PATHS } from '@config';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { Trans, translateRaw } from '@translations';
import { StoreAsset } from '@types';
import { convertToFiatFromAsset } from '@utils';

const TokenListWrapper = styled.div`
  min-height: 0;
  overflow-y: auto;
  padding: 0 ${SPACING.BASE} ${SPACING.BASE} ${SPACING.BASE};
`;

const Token = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.SM} 0;
  margin-right: 8px;
`;

const Asset = styled.div`
  display: flex;
  align-items: center;
  width: 65%;
`;

const AssetName = styled(Typography)`
  margin: 0 0 0 ${SPACING.SM} !important;
  font-weight: normal;
  font-size: ${FONT_SIZE.SM};
`;

const TokenValueWrapper = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`;

const TokenValue = styled(Typography)`
  margin: 0 ${SPACING.SM} 0 0 !important;
  font-weight: normal;
  font-size: ${FONT_SIZE.BASE};
`;

const MoreIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  padding: 9px 16px;
  font-size: ${FONT_SIZE.MD};
  margin-left: 8px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

const TokenDashboardPanel = styled(DashboardPanel)`
  max-height: 500px;
`;

interface TokenListProps {
  isScanning: boolean;
  tokens: StoreAsset[];
  showValue?: boolean;
  setShowDetailsView(show: boolean): void;
  setShowAddToken(setShowAddToken: boolean): void;
  setCurrentToken(token: StoreAsset): void;
  handleScanTokens(): Promise<void>;
}

export function TokenList(props: TokenListProps) {
  const {
    setShowDetailsView,
    setCurrentToken,
    tokens,
    showValue = false,
    isScanning,
    setShowAddToken,
    handleScanTokens
  } = props;
  const sortedTokens = tokens.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <TokenDashboardPanel
      heading={
        <>
          {translateRaw('TOKENS')} <Tooltip tooltip={translateRaw('DASHBOARD_TOKENS_TOOLTIP')} />
        </>
      }
      headingRight={
        <div style={{ minWidth: '170px', textAlign: 'right' }}>
          <StyledButton onClick={() => handleScanTokens()}>
            {translateRaw('SCAN_TOKENS_SHORT')}
          </StyledButton>
          <StyledButton onClick={() => setShowAddToken(true)}>
            + {translateRaw('ADD_TOKEN_SHORT')}
          </StyledButton>
        </div>
      }
      padChildren={false}
    >
      {isScanning ? (
        <SpinnerWrapper>
          <Spinner size={3} />
        </SpinnerWrapper>
      ) : (
        <TokenListWrapper>
          {sortedTokens.length > 0 ? (
            sortedTokens.map((token) => (
              <Token key={token.uuid}>
                <Asset>
                  <AssetIcon uuid={token.uuid} size={'26px'} />
                  <AssetName>{token.name}</AssetName>
                </Asset>
                <TokenValueWrapper>
                  {showValue && (
                    <TokenValue>${convertToFiatFromAsset(token, token.rate)}</TokenValue>
                  )}
                  <MoreIcon
                    type="more"
                    height="24px"
                    alt="More"
                    onClick={() => {
                      setShowDetailsView(true);
                      setCurrentToken(token);
                    }}
                  />
                </TokenValueWrapper>
              </Token>
            ))
          ) : (
            <>
              <Heading color={COLORS.BLUE_GREY} textAlign="center" fontWeight="bold">
                {translate('NO_TOKENS_HEADER')}
              </Heading>
              <Body color={COLORS.BLUE_GREY} textAlign="center">
                <Trans
                  id="NO_TOKENS_CONTENT"
                  variables={{
                    $link: () => (
                      <RouterLink to={ROUTE_PATHS.SWAP.path}>
                        {translateRaw('GET_SOME_HERE')}
                      </RouterLink>
                    )
                  }}
                />
              </Body>
            </>
          )}
        </TokenListWrapper>
      )}
    </TokenDashboardPanel>
  );
}
