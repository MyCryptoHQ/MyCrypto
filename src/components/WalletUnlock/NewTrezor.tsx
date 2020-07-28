import React, { useContext, useState } from 'react';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { MOONPAY_ASSET_UUIDS } from '@utils';
import { FormData, WalletId, ExtendedAsset } from '@types';
import translate, { translateRaw } from '@translations';
import { Spinner, Button, DeterministicAccountList, AssetSelector } from '@components';
import {
  EXT_URLS,
  TREZOR_DERIVATION_PATHS,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DEFAULT_GAP_TO_SCAN_FOR
} from '@config';
import {
  NetworkContext,
  getNetworkById,
  getAssetByUUID,
  AssetContext,
  useDeterministicWallet
} from '@services';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
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
  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const { state, requestConnection, updateAsset } = useDeterministicWallet(
    extendedDPaths,
    WalletId.TREZOR_NEW,
    DEFAULT_GAP_TO_SCAN_FOR
  );
  // @todo -> Figure out which assets to display in dropdown. Selector is heavy with 900+ assets in it. Loads slow af.
  const filteredAssets = assets.filter(({ uuid }) => MOONPAY_ASSET_UUIDS.includes(uuid)); // @todo - fix this.

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
      <div className="Mnemonic-dpath">
        <AssetSelector
          selectedAsset={assetToUse}
          assets={filteredAssets}
          onSelect={(option: ExtendedAsset) => {
            handleAssetUpdate(option);
          }}
        />
        <DeterministicAccountList
          onUnlock={onUnlock}
          isComplete={state.completed}
          asset={state.asset}
          finishedAccounts={state.finishedAccounts}
          network={network}
        />
      </div>
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
            {translate('HOWTO_TREZOR')}
          </div>
        </div>
      </div>
    );
  }
};

export default TrezorDecrypt;
