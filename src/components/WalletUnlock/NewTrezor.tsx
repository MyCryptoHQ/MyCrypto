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
  useDeterministicWallet,
  useNetworks
} from '@services';
import { translateRaw } from '@translations';
import { ExtendedAsset, FormData, WalletId } from '@types';

import { DeterministicWallet } from './components';
import HardwareWalletUI from './Hardware';
import UnsupportedNetwork from './UnsupportedNetwork';

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
    state,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses
  } = useDeterministicWallet(extendedDPaths, WalletId.TREZOR_NEW, DEFAULT_GAP_TO_SCAN_FOR);

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  if (!network) {
    // @todo: make this better.
    return <UnsupportedNetwork walletType={translateRaw('X_TREZOR')} network={network} />;
  }

  if (state.isConnected && state.asset && (state.queuedAccounts || state.finishedAccounts)) {
    return (
      <DeterministicWallet
        state={state}
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
        network={network}
        state={state}
        handleNullConnect={handleNullConnect}
        walletId={WalletId.TREZOR_NEW}
      />
    );
  }
};

export default TrezorDecrypt;
