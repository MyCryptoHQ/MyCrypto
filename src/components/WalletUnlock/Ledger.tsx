import React, { useContext, useState } from 'react';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { MOONPAY_ASSET_UUIDS } from '@utils';
import { FormData, WalletId, ExtendedAsset } from '@types';
import translate, { translateRaw, Trans } from '@translations';
import { NewTabLink, Spinner, Button, DeterministicAccountList, AssetDropdown } from '@components';
import {
  EXT_URLS,
  LEDGER_DERIVATION_PATHS,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DEFAULT_GAP_TO_SCAN_FOR,
  DPathsList
} from '@config';
import {
  NetworkContext,
  getNetworkById,
  getAssetByUUID,
  AssetContext,
  useDeterministicWallet,
  getDPaths
} from '@services';

import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
import UnsupportedNetwork from './UnsupportedNetwork';
import './LedgerNano.scss';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// const WalletService = WalletFactory(WalletId.LEDGER_NANO_S);

const LedgerDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const network = getNetworkById(formData.network, networks);
  const dpaths = uniqBy(prop('value'), [
    ...getDPaths([network], WalletId.LEDGER_NANO_S),
    ...LEDGER_DERIVATION_PATHS
  ]);
  const defaultDPath = network.dPaths[WalletId.LEDGER_NANO_S] || DPathsList.ETH_LEDGER;
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    state,
    requestConnection,
    updateAsset,
    addDPaths,
    generateFreshAddress
  } = useDeterministicWallet(extendedDPaths, WalletId.LEDGER_NANO_S_NEW, DEFAULT_GAP_TO_SCAN_FOR);
  const [freshAddressIndex, setFreshAddressIndex] = useState(0);
  // @todo -> Figure out which assets to display in dropdown. Dropdown is heavy with 900+ assets in it. Loads slow af.
  const filteredAssets = assets.filter(({ uuid }) => MOONPAY_ASSET_UUIDS.includes(uuid)); // @todo - fix this.

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  const testDPathAddition: DPath = {
    label: 'Test Ledger Live (ETH)',
    value: "m/44'/60'/0'/0/0",
    isHardened: true,
    getIndex: (addressIndex): string => `m/44'/60'/${addressIndex}'/0/0`
  };

  const handleDPathAddition = () => {
    addDPaths([
      {
        ...testDPathAddition,
        offset: 0,
        numOfAddresses: numOfAccountsToCheck
      }
    ]);
  };

  const handleFreshAddressGeneration = () => {
    if (freshAddressIndex > DEFAULT_GAP_TO_SCAN_FOR) {
      return;
    }
    const freshAddressGenerationSuccess = generateFreshAddress({
      ...defaultDPath,
      offset: freshAddressIndex,
      numOfAddresses: 1
    });
    if (freshAddressGenerationSuccess) {
      setFreshAddressIndex(freshAddressIndex + 1);
    }
  };

  if (!network) {
    // @todo: make this better.
    return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
  }

  if (!process.env.BUILD_ELECTRON && window.location.protocol !== 'https:') {
    return (
      <div className="Panel">
        <div className="alert alert-danger">
          <Trans
            id="UNLOCKING_LEDGER_ONLY_POSSIBLE_ON_OVER_HTTPS"
            variables={{
              $newTabLink: () => <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
            }}
          />
        </div>
      </div>
    );
  }

  if (state.isConnected && state.asset && (state.queuedAccounts || state.finishedAccounts)) {
    return (
      <div className="Mnemonic-dpath">
        <Button onClick={() => handleDPathAddition()}>
          {`Test Add Custom Derivation Path: ${testDPathAddition.value} - ${testDPathAddition.label} `}
        </Button>
        <br />
        <Button
          disabled={!state.completed || freshAddressIndex > DEFAULT_GAP_TO_SCAN_FOR}
          onClick={() => handleFreshAddressGeneration()}
        >
          {`Test Generate Fresh Address`}
        </Button>
        {freshAddressIndex > DEFAULT_GAP_TO_SCAN_FOR && (
          <p>
            {translateRaw('DPATH_GENERATE_FRESH_ADDRESS_GAP_ERROR', {
              $gap: DEFAULT_GAP_TO_SCAN_FOR.toString()
            })}
          </p>
        )}
        <br />
        <AssetDropdown
          selectedAsset={assetToUse}
          assets={filteredAssets}
          onSelect={(option: ExtendedAsset) => {
            handleAssetUpdate(option);
          }}
        />
        <DeterministicAccountList
          isComplete={state.completed}
          asset={state.asset}
          finishedAccounts={state.finishedAccounts}
          onUnlock={onUnlock}
        />
      </div>
    );
  } else {
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')}{' '}
          {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_LEDGER') })}
        </div>
        <div className="LedgerPanel-description-content">
          <div className="LedgerPanel-description">
            {translate('LEDGER_TIP')}
            <div className="LedgerPanel-image">
              <img src={ledgerIcon} />
            </div>
            {/* <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>
							{error || '-'}
						</div> */}
            {state.isConnecting ? (
              <div className="LedgerPanel-loading">
                <Spinner /> {translate('WALLET_UNLOCKING')}
              </div>
            ) : (
              <Button
                className="LedgerPanel-description-button"
                onClick={() => handleNullConnect()}
                disabled={state.isConnecting}
              >
                {translate('ADD_LEDGER_SCAN')}
              </Button>
            )}
          </div>
          <div className="LedgerPanel-footer">
            {translate('LEDGER_REFERRAL_2', { $url: EXT_URLS.LEDGER_REFERRAL.url })}
            {/*<br />
						{translate('LEDGER_HELP_LINK')} */}
          </div>
        </div>
      </div>
    );
  }
};

export default LedgerDecrypt;
