import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { DashboardPanel, Spinner, AssetIcon } from 'v2/components';
import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';
import { translateRaw } from 'translations';
import { StoreContext, RatesContext, TokenInfoService } from 'v2/services';
import { TTicker, AssetWithDetails, TSymbol, ExtendedAsset } from 'v2/types';

import backArrowIcon from 'common/assets/images/icn-back.svg';
import expandIcon from 'common/assets/images/icn-expand.svg';

const etherscanUrl = ' https://etherscan.io/token/';

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

const TokenIcon = styled.div`
  margin-right: 8px;
  display: flex;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

const DetailsHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export function TokenPanel() {
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<AssetWithDetails>();
  const [allTokens, setAllTokens] = useState<AssetWithDetails[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const { accounts, totals, currentAccounts, scanTokens } = useContext(StoreContext);
  const { getRate, rates } = useContext(RatesContext);

  const handleScanTokens = async (asset?: ExtendedAsset) => {
    try {
      setIsScanning(true);
      await scanTokens(asset);
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
        heading={translateRaw('TOKENS')}
        headingRight={
          <div>
            <StyledButton onClick={() => handleScanTokens()}>
              {translateRaw('SCAN_TOKENS')}
            </StyledButton>
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
              <DetailsHeadingWrapper>
                <BackIcon src={backArrowIcon} onClick={() => setShowDetailsView(false)} />
                <TokenIcon>
                  <AssetIcon symbol={currentToken.ticker as TSymbol} size={'26px'} />
                </TokenIcon>
                {currentToken.name}
              </DetailsHeadingWrapper>
            }
            headingRight={
              <a
                href={`${etherscanUrl}${currentToken.contractAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon src={expandIcon} />
              </a>
            }
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
