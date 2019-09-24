import React, { useState, useContext, useEffect } from 'react';

import { StoreContext, RatesContext, TokenInfoService } from 'v2/services';
import { TTicker, AssetWithDetails, ExtendedAsset } from 'v2/types';
import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';

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
        return !asset.contractAddress
          ? tokens
          : [
              ...tokens,
              Object.assign(asset, {
                rate: getRate(asset.ticker as TTicker) || 0,
                details:
                  tokensDetails.find(details => details.address === asset.contractAddress) || {}
              })
            ];
      }, []);

      setAllTokens(tempTokens);
    };

    getTokensWithDetails();
  }, [accounts, rates]);

  return showDetailsView && currentToken ? (
    <TokenDetails currentToken={currentToken} setShowDetailsView={setShowDetailsView} />
  ) : showAddToken ? (
    <AddToken
      setShowDetailsView={setShowDetailsView}
      setShowAddToken={setShowAddToken}
      scanTokens={handleScanTokens}
    />
  ) : (
    <TokenList
      tokens={allTokens}
      setShowDetailsView={setShowDetailsView}
      setCurrentToken={setCurrentToken}
      isScanning={isScanning}
      setShowAddToken={setShowAddToken}
      handleScanTokens={handleScanTokens}
    />
  );
}
