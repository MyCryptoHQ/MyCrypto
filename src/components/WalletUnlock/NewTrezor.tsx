import React, { useState } from 'react';

import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import { Button, RouterLink, Spinner } from '@components';
import {
  DEFAULT_GAP_TO_SCAN_FOR,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DPathsList,
  EXT_URLS,
  TREZOR_DERIVATION_PATHS
} from '@config';
import {
  getAssetByUUID,
  getNetworkById,
  useAssets,
  useDeterministicWallet,
  useNetworks
} from '@services';
import translate, { Trans, translateRaw } from '@translations';
import { ExtendedAsset, FormData, WalletId } from '@types';

import DeterministicWallet from './DeterministicWallet';
import UnsupportedNetwork from './UnsupportedNetwork';
import './NewTrezor.scss';

//@todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

const TrezorDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const dpaths = uniqBy(prop('value'), TREZOR_DERIVATION_PATHS);
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const defaultDPath = network.dPaths[WalletId.TREZOR] || DPathsList.ETH_TREZOR;
  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    state,
    requestConnection,
    updateAsset,
    generateFreshAddress,
    addDPaths
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
    return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
  }

  if (state.isConnected && state.asset && (state.queuedAccounts || state.finishedAccounts)) {
    return (
      <DeterministicWallet
        state={state}
        defaultDPath={defaultDPath}
        assets={assets}
        assetToUse={assetToUse}
        network={network}
        updateAsset={updateAsset}
        addDPaths={addDPaths}
        generateFreshAddress={generateFreshAddress}
        handleAssetUpdate={handleAssetUpdate}
        onUnlock={onUnlock}
      />
    );
  } else {
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')}{' '}
          {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_TREZOR') })}
        </div>
        <div className="TrezorDecrypt">
          <div className="TrezorDecrypt-description">
            {translate('TREZOR_TIP')}
            <div className="TrezorDecrypt-img">
              <img src={ConnectTrezor} />
            </div>
          </div>
          {/* <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>
            {error || '-'}
          </div> */}

          {state.isConnecting ? (
            <div className="TrezorDecrypt-loading">
              <Spinner /> {translate('WALLET_UNLOCKING')}
            </div>
          ) : (
            <Button
              className="TrezorDecrypt-button"
              onClick={() => handleNullConnect()}
              disabled={state.isConnecting}
            >
              {translate('ADD_TREZOR_SCAN')}
            </Button>
          )}
          <div className="TrezorDecrypt-footer">
            {translate('ORDER_TREZOR', { $url: EXT_URLS.TREZOR_REFERRAL.url })} <br />
            <Trans
              id="USE_OLD_INTERFACE"
              variables={{
                $link: () => (
                  <RouterLink to="/add-account/trezor">
                    {translateRaw('TRY_OLD_INTERFACE')}
                  </RouterLink>
                )
              }}
            />
            <br />
            {translate('HOWTO_TREZOR')}
          </div>
        </div>
      </div>
    );
  }
};

export default TrezorDecrypt;
