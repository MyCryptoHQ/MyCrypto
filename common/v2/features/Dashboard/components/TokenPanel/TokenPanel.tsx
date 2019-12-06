import React, { useState, useContext, useEffect } from 'react';

import { StoreContext, RatesContext, TokenInfoService } from 'v2/services';
import { AssetWithDetails, ExtendedAsset, StoreAsset } from 'v2/types';
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
  const { getAssetRate, rates } = useContext(RatesContext);

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
    // Fetches token details by contract address
    const fetchTokenDetails = async () => {
      const tokens = totals(currentAccounts())
        .map(x => x.contractAddress!)
        .filter(x => x);
      TokenInfoService.instance.getTokensInfo(tokens).then(setTokenData);
    };
    fetchTokenDetails();
  }, [accounts]);

  const addDetailsToTokens = (totalStoreAssets: StoreAsset[], tokenInfoData: any[]) =>
    totalStoreAssets.reduce((tokens: AssetWithDetails[], asset) => {
      return !asset.contractAddress
        ? tokens
        : [
            ...tokens,
            Object.assign({}, asset, {
              rate: getAssetRate(asset) || 0,
              details:
                tokenInfoData.find(
                  details => details.address.toLowerCase() === asset.contractAddress!.toLowerCase()
                ) || {}
            })
          ];
    }, []);

  useEffect(() => {
    const tokensWithDetails = addDetailsToTokens(totals(currentAccounts()), tokenData);
    setAllTokens(tokensWithDetails);
  }, [accounts, rates, tokenData]);

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
