import React, { useState } from 'react';

import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';

import {
  DEFAULT_GAP_TO_SCAN_FOR,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DPathsList,
  TREZOR_DERIVATION_PATHS
} from '@config';
import {
  getAssetByUUID,
  getDPaths,
  getNetworkById,
  useAssets,
  useHDWallet,
  useNetworks
} from '@services';
import { ExtendedAsset, FormData, WalletId } from '@types';

import { HDWallet } from './components';
import HardwareWalletUI from './Hardware';

//@todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

const TrezorDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const dpaths = uniqBy(prop('value'), [
    ...getDPaths([network], WalletId.TREZOR_NEW),
    ...TREZOR_DERIVATION_PATHS
  ]);
  const defaultDPath = network.dPaths[WalletId.TREZOR] || DPathsList.ETH_TREZOR;
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
    scanMoreAddresses
  } = useHDWallet(extendedDPaths, WalletId.TREZOR_NEW, DEFAULT_GAP_TO_SCAN_FOR);

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
        dpaths={dpaths}
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
        walletId={WalletId.TREZOR_NEW}
      />
    );
  }
};

export default TrezorDecrypt;
