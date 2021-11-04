import { useState } from 'react';

import { DEFAULT_ETH, GRIDPLUS_DERIVATION_PATHS } from '@mycrypto/wallets';
import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';

import { DEFAULT_GAP_TO_SCAN_FOR, DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN } from '@config';
import { HDWallet } from '@features/AddAccount';
import {
  getAssetByUUID,
  getDPaths,
  getNetworkById,
  useAssets,
  useHDWallet,
  useNetworks
} from '@services';
import { ExtendedAsset, FormData, WalletId } from '@types';

import HardwareWalletUI from './Hardware';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

export const GridPlus = ({ formData, onUnlock }: OwnProps) => {
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const dpaths = uniqBy(prop('path'), [
    ...getDPaths([network], WalletId.GRIDPLUS),
    ...GRIDPLUS_DERIVATION_PATHS
  ]);
  const defaultDPath = network.dPaths[WalletId.GRIDPLUS] || DEFAULT_ETH;
  const [selectedDPath, setSelectedDPath] = useState(defaultDPath);
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));

  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    isCompleted,
    isConnected,
    isConnecting,
    connectionError,
    selectedAsset,
    accountQueue,
    scannedAccounts,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses,
    mergedDPaths
  } = useHDWallet(extendedDPaths, WalletId.GRIDPLUS, DEFAULT_GAP_TO_SCAN_FOR);

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  if (isConnected && selectedAsset && (accountQueue || scannedAccounts)) {
    return (
      <HDWallet
        scannedAccounts={scannedAccounts}
        isCompleted={isCompleted}
        selectedAsset={selectedAsset}
        selectedDPath={selectedDPath}
        assets={assets}
        assetToUse={assetToUse}
        network={network}
        dpaths={mergedDPaths}
        setSelectedDPath={setSelectedDPath}
        updateAsset={updateAsset}
        addDPaths={addDPaths}
        scanMoreAddresses={scanMoreAddresses}
        handleAssetUpdate={handleAssetUpdate}
        onUnlock={onUnlock}
      />
    );
  } else {
    return (
      <HardwareWalletUI
        isConnecting={isConnecting}
        connectionError={connectionError}
        network={network}
        handleNullConnect={handleNullConnect}
        walletId={WalletId.GRIDPLUS}
      />
    );
  }
};
