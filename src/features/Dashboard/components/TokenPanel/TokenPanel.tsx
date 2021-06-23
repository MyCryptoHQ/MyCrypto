import { useState } from 'react';

import { useRates, useSettings } from '@services';
import { calculateTotals, isNotExcludedAsset } from '@services/Store/helpers';
import {
  isScanning as isScanningSelector,
  scanTokens,
  selectCurrentAccounts,
  useDispatch,
  useSelector
} from '@store';
import { ExtendedAsset, StoreAsset } from '@types';

import { AddToken } from './AddToken';
import { TokenDetails } from './TokenDetails';
import { TokenList } from './TokenList';

export function TokenPanel() {
  const currentAccounts = useSelector(selectCurrentAccounts);
  const isScanning = useSelector(isScanningSelector);
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { getAssetRate } = useRates();
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showAddToken, setShowAddToken] = useState(false);
  const [currentToken, setCurrentToken] = useState<StoreAsset>();
  const allTokens = calculateTotals(currentAccounts)
    .reduce((acc, a) => {
      if (a.contractAddress) {
        acc.push({ ...a, rate: getAssetRate(a) || 0 });
      }
      return acc;
    }, [] as StoreAsset[])
    .filter(isNotExcludedAsset(settings.excludedAssets));

  const handleScanTokens = (asset?: ExtendedAsset) => {
    dispatch(scanTokens({ assets: asset && [asset] }));
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
