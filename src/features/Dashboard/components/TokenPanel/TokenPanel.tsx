import React, { useContext, useState } from 'react';

import { StoreContext, useRates, useSettings } from '@services';
import { isNotExcludedAsset } from '@services/Store/helpers';
import { ExtendedAsset, StoreAsset } from '@types';

import { AddToken } from './AddToken';
import { TokenDetails } from './TokenDetails';
import { TokenList } from './TokenList';

export function TokenPanel() {
  const { totals, currentAccounts, scanTokens, isScanning } = useContext(StoreContext);
  const { settings } = useSettings();
  const { getAssetRate } = useRates();
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<StoreAsset>();
  const allTokens = totals(currentAccounts)
    .reduce((acc, a) => {
      if (a.contractAddress) {
        acc.push({ ...a, rate: getAssetRate(a) || 0 });
      }
      return acc;
    }, [] as StoreAsset[])
    .filter(isNotExcludedAsset(settings.excludedAssets));

  const handleScanTokens = async (asset?: ExtendedAsset) => {
    await scanTokens(asset);
  };

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
