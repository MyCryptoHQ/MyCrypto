import React, { useState } from 'react';

import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';
import styled from 'styled-components';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import { Box, Button, Heading, InlineMessage, RouterLink, Spinner } from '@components';
import {
  DEFAULT_GAP_TO_SCAN_FOR,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DPathsList,
  EXT_URLS,
  TREZOR_DERIVATION_PATHS
} from '@config';
import {
  DeterministicWalletState,
  getAssetByUUID,
  getNetworkById,
  useAssets,
  useDeterministicWallet,
  useNetworks
} from '@services';
import translate, { Trans, translateRaw } from '@translations';
import { ExtendedAsset, FormData, InlineMessageType, WalletId } from '@types';

import DeterministicWallet from './DeterministicWallet';
import UnsupportedNetwork from './UnsupportedNetwork';

const TrezorPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 400px;
  position: relative;
  justify-content: center;
`;

const TrezorDescription = styled.div`
  line-height: 1.5;
  letter-spacing: normal;
  color: #333333;
  padding-top: 16px;
  justify-content: center;
  text-align: center;
  align-content: center;
  align-items: center;

  @media (max-width: 700px) {
    height: 350px;
  }
`;

const TrezorContent = styled.div`
  justify-content: center;
  text-align: center;
  align-content: center;
`;

const TrezorImageContainer = styled.div`
  vertical-align: center;
  margin: 2em;

  @media (max-width: 700px) {
    margin: 0.25em;
    padding: 0.5em;
  }
`;

const ErrorMessageContainer = styled.div`
  margin: 2em;
`;

const TrezorFooter = styled.div`
  @media (max-width: 700px) {
    margin-bottom: 20px;
  }
`;

const TrezorConnectBtn = styled(Button)`
  margin-bottom: 2em;
  width: 420px;

  @media (max-width: 700px) {
    width: 345px;
    margin-bottom: 0em;
  }
`;

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
    return <TrezorUnlockUI state={state} handleNullConnect={handleNullConnect} />;
  }
};

interface TrezorUIProps {
  state: DeterministicWalletState;
  handleNullConnect(): void;
}

export const TrezorUnlockUI = ({ state, handleNullConnect }: TrezorUIProps) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('UNLOCK_WALLET')}{' '}
      {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_TREZOR') })}
    </Heading>
    <TrezorPanel>
      <TrezorContent>
        <TrezorDescription>
          {translate('TREZOR_TIP')}
          <TrezorImageContainer>
            <img src={ConnectTrezor} />
          </TrezorImageContainer>
          {state.error && (
            <ErrorMessageContainer>
              <InlineMessage
                type={InlineMessageType.ERROR}
                value={`${translateRaw('GENERIC_HARDWARE_ERROR')} ${state.error.message}`}
              />
            </ErrorMessageContainer>
          )}
          {state.isConnecting ? (
            <div className="TrezorDecrypt-loading">
              <Spinner /> {translate('WALLET_UNLOCKING')}
            </div>
          ) : (
            <TrezorConnectBtn onClick={() => handleNullConnect()} disabled={state.isConnecting}>
              {translate('ADD_TREZOR_SCAN')}
            </TrezorConnectBtn>
          )}
        </TrezorDescription>
        <TrezorFooter>
          {translate('ORDER_TREZOR', { $url: EXT_URLS.TREZOR_REFERRAL.url })}
          <br />
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
        </TrezorFooter>
      </TrezorContent>
    </TrezorPanel>
  </Box>
);

export default TrezorDecrypt;
