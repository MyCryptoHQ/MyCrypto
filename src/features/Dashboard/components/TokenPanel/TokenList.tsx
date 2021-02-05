import React from 'react';

import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  AssetIcon,
  Body,
  Box,
  DashboardPanel,
  Heading,
  Icon,
  RouterLink,
  SkeletonLoader,
  Text,
  Tooltip
} from '@components';
import { ROUTE_PATHS } from '@config';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
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

const TokenDashboardPanel = styled(DashboardPanel)`
  max-height: 740px;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    min-height: 430px;
    height: 652px;
  }
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
          {translateRaw('TOKENS')}{' '}
          <Tooltip width="16px" tooltip={translateRaw('DASHBOARD_TOKENS_TOOLTIP')} />
        </>
      }
      headingRight={
        <Box variant="rowAlign">
          <Box variant="rowAlign" marginRight={SPACING.MD} onClick={() => handleScanTokens()}>
            <Icon type="refresh" width="16px" />
            <Text variant="defaultLink" ml={SPACING.XS} mb={0} color="BLUE_BRIGHT">
              {translateRaw('SCAN_TOKENS_SHORT')}
            </Text>
          </Box>

          <Box variant="rowAlign" onClick={() => setShowAddToken(true)}>
            <Icon type="add-bold" width="16px" />
            <Text variant="defaultLink" ml={SPACING.XS} mb={0} color="BLUE_BRIGHT">
              {translateRaw('ADD_TOKEN_SHORT')}
            </Text>
          </Box>
        </Box>
      }
      padChildren={false}
    >
      {isScanning ? (
        <TokenListWrapper>
          <SkeletonLoader type="token-list" />
        </TokenListWrapper>
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
