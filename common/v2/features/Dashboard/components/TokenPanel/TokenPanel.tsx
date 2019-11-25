import React, { useState, useContext, useEffect } from 'react';

import { StoreContext, RatesContext, TokenInfoService } from 'v2/services';
import { AssetWithDetails, ExtendedAsset } from 'v2/types';
import { TokenList } from './TokenList';
import { TokenDetails } from './TokenDetails';
import { AddToken } from './AddToken';

export function TokenPanel() {
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<AssetWithDetails>();
  const [allTokens, setAllTokens] = useState<AssetWithDetails[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [tokenData, setTokenData] = useState([] as any[]);

  const { accounts, totals, currentAccounts, scanTokens } = useContext(StoreContext);
  const { getRateFromAsset, rates } = useContext(RatesContext);

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
    const fetchTokenDetails = async () => {
      const selectedAccounts = currentAccounts();
      const tokenTotals = totals(selectedAccounts);
      const detailedTokenData: any[] = await TokenInfoService.instance.getTokensInfo(
        tokenTotals.map(x => x.contractAddress!).filter(x => x)
      );
      setTokenData(detailedTokenData);
    };
    fetchTokenDetails();
  }, [accounts]);

  useEffect(() => {
    const getTokensWithDetails = async () => {
      const selectedAccounts = currentAccounts();

      // Add token details and token rate info to all assets that have  a contractAddress
      const tempTokens = totals(selectedAccounts).reduce((tokens: AssetWithDetails[], asset) => {
        return !asset.contractAddress
          ? tokens
          : [
              ...tokens,
              Object.assign(asset, {
                rate: getRateFromAsset(asset) || 0,
                details: tokenData.find(details => details.address === asset.contractAddress) || {}
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
