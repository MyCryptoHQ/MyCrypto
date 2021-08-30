import { useState } from 'react';

import { LEDGER_DERIVATION_PATHS, LEDGER_ETH } from '@mycrypto/wallets';

import { LinkApp } from '@components';
import HardwareWalletUI from '@components/WalletUnlock/Hardware';
import {
  DEFAULT_GAP_TO_SCAN_FOR,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  ETHEREUM_NETWORKS
} from '@config';
import { HDWallet } from '@features/AddAccount';
import {
  getAssetByUUID,
  getDPaths,
  getNetworkById,
  useAssets,
  useHDWallet,
  useNetworks
} from '@services';
import { Trans } from '@translations';
import { ExtendedAsset, FormData, WalletId } from '@types';
import { prop, uniqBy } from '@vendor';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

const LedgerDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const defaultDPath = network.dPaths[WalletId.LEDGER_NANO_S] || LEDGER_ETH;
  const [selectedDPath, setSelectedDPath] = useState(defaultDPath);
  const dpaths = uniqBy(prop('path'), [
    ...getDPaths([network], WalletId.LEDGER_NANO_S),
    ...(ETHEREUM_NETWORKS.includes(formData.network) ? LEDGER_DERIVATION_PATHS : [])
  ]);
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    selectedAsset,
    scannedAccounts,
    accountQueue,
    isCompleted,
    isConnected,
    isConnecting,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses,
    connectionError,
    mergedDPaths
  } = useHDWallet(extendedDPaths, WalletId.LEDGER_NANO_S_NEW, DEFAULT_GAP_TO_SCAN_FOR);
  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };
  if (window.location.protocol !== 'https:') {
    return (
      <div className="Panel">
        <div className="alert alert-danger">
          <Trans
            id="UNLOCKING_LEDGER_ONLY_POSSIBLE_ON_OVER_HTTPS"
            variables={{
              $link: () => (
                <LinkApp href="https://mycrypto.com" isExternal={true}>
                  MyCrypto.com
                </LinkApp>
              )
            }}
          />
        </div>
      </div>
    );
  }

  if (isConnected && selectedAsset && (accountQueue || scannedAccounts)) {
    return (
      <HDWallet
        scannedAccounts={scannedAccounts}
        isCompleted={isCompleted}
        selectedAsset={selectedAsset}
        dpaths={mergedDPaths}
        assets={assets}
        assetToUse={assetToUse}
        network={network}
        selectedDPath={selectedDPath}
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
        walletId={WalletId.LEDGER_NANO_S_NEW}
      />
    );
  }
};

export default LedgerDecrypt;
