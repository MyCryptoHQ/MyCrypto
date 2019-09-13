import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { DashboardPanel, Spinner } from 'v2/components';
import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';
import { translateRaw } from 'translations';
import { StoreContext, RatesContext, TokenInfoService } from 'v2/services';
import { TTicker, AssetWithDetails } from 'v2/types';

import backArrowIcon from 'common/assets/images/icn-back.svg';
import expandIcon from 'common/assets/images/icn-expand.svg';

const defaultTokenIcon = 'https://via.placeholder.com/28';

const Icon = styled.img`
  cursor: pointer;
`;

const BackIcon = styled(Icon)`
  margin-right: 16px;
`;

const StyledButton = styled(Button)`
  padding: 9px 16px;
  font-size: 18px;
  margin-left: 8px;
`;

const TokenIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 8px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

export function TokenPanel() {
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<AssetWithDetails>();
  const [allTokens, setAllTokens] = useState<AssetWithDetails[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const { accounts, totals, currentAccounts, scanTokens } = useContext(StoreContext);
  const { getRate, rates } = useContext(RatesContext);

  const handleScanTokens = async () => {
    try {
      setIsScanning(true);
      await scanTokens();
      setIsScanning(false);
    } catch (e) {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const getTokensWithDetails = async () => {
      const selectedAccounts = currentAccounts();
      const tokenTotals = totals(selectedAccounts);

      // Fetch details for all tokens of selected accounts
      const tokensDetails: any[] = await TokenInfoService.instance.getTokensInfo(
        tokenTotals.map(x => x.contractAddress!).filter(x => x)
      );

      // Add token details and token rate info to all assets that have  a contractAddress
      const tempTokens = totals(selectedAccounts).reduce((tokens: AssetWithDetails[], asset) => {
        if (asset.contractAddress) {
          const existingTokenDetails = tokensDetails.find(
            details => details.address === asset.contractAddress
          );

          tokens.push(
            Object.assign(asset, {
              rate: getRate(asset.ticker as TTicker) || 0,
              details: existingTokenDetails || {}
            })
          );
        }
        return tokens;
      }, []);

      setAllTokens(tempTokens);
    };

    getTokensWithDetails();
  }, [accounts, rates]);

  const TokenListPanel = () => {
    return (
      <DashboardPanel
        heading="Tokens"
        headingRight={
          <div>
            <StyledButton onClick={handleScanTokens}>{translateRaw('SCAN_TOKENS')}</StyledButton>
            <StyledButton onClick={() => setShowAddToken(true)}>
              + {translateRaw('ADD_TOKEN')}
            </StyledButton>
          </div>
        }
        padChildren={true}
      >
        {isScanning ? (
          <SpinnerWrapper>
            <Spinner size="x3" />
          </SpinnerWrapper>
        ) : (
          <TokenList
            tokens={allTokens}
            setShowDetailsView={setShowDetailsView}
            setCurrentToken={setCurrentToken}
          />
        )}
      </DashboardPanel>
    );
  };

  const DetailsPanel = () => {
    return (
      <>
        {currentToken && (
          <DashboardPanel
            heading={
              <div>
                <BackIcon src={backArrowIcon} onClick={() => setShowDetailsView(false)} />
                <TokenIcon
                  src={
                    currentToken.details.logo
                      ? currentToken.details.logo.src || defaultTokenIcon
                      : defaultTokenIcon
                  }
                  alt={currentToken.name}
                />
                {currentToken.name}
              </div>
            }
            headingRight={<Icon src={expandIcon} />}
            padChildren={true}
          >
            <TokenDetails currentToken={currentToken} />
          </DashboardPanel>
        )}
      </>
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
        <AddToken setShowAddToken={setShowAddToken} scanTokens={handleScanTokens} />
      </DashboardPanel>
    );
  };

  return showDetailsView ? <DetailsPanel /> : showAddToken ? <AddTokenPanel /> : <TokenListPanel />;
}
