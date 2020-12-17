import React, { useState } from 'react';

import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';
import styled from 'styled-components';

import {
  Box,
  Button,
  Heading,
  Icon,
  InlineMessage,
  NewTabLink,
  RouterLink,
  Spinner
} from '@components';
import {
  DEFAULT_GAP_TO_SCAN_FOR,
  DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN,
  DPathsList,
  EXT_URLS,
  LEDGER_DERIVATION_PATHS
} from '@config';
import {
  DeterministicWalletState,
  getAssetByUUID,
  getDPaths,
  getNetworkById,
  useAssets,
  useDeterministicWallet,
  useNetworks
} from '@services';
import translate, { Trans, translateRaw } from '@translations';
import { ExtendedAsset, FormData, InlineMessageType, Network, WalletId } from '@types';

import DeterministicWallet from './DeterministicWallet';
import UnsupportedNetwork from './UnsupportedNetwork';

const LedgerPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 400px;
  position: relative;
  justify-content: center;
`;

const LedgerDescription = styled.div`
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

const LedgerContent = styled.div`
  justify-content: center;
  text-align: center;
  align-content: center;
`;

const LedgerImageContainer = styled.div`
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

const LedgerFooter = styled.div`
  @media (max-width: 700px) {
    margin-bottom: 20px;
  }
`;

const LedgerConnectBtn = styled(Button)`
  margin-bottom: 2em;
  width: 420px;

  @media (max-width: 700px) {
    width: 345px;
    margin-bottom: 0em;
  }
`;

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// const WalletService = WalletFactory(WalletId.LEDGER_NANO_S);

const LedgerDecrypt = ({ formData, onUnlock }: OwnProps) => {
  const { networks } = useNetworks();
  const { assets } = useAssets();
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

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };

  if (!network) {
    // @todo: make this better.
    return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
  }

  if (window.location.protocol !== 'https:') {
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
    return <LedgerUnlockUI network={network} state={state} handleNullConnect={handleNullConnect} />;
  }
};

interface LedgerUIProps {
  network: Network;
  state: DeterministicWalletState;
  handleNullConnect(): void;
}

export const LedgerUnlockUI = ({ network, state, handleNullConnect }: LedgerUIProps) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('UNLOCK_WALLET')}{' '}
      {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_LEDGER') })}
    </Heading>
    <LedgerPanel>
      <LedgerContent>
        <LedgerDescription>
          {translate('LEDGER_TIP', { $network: network.id })}
          <LedgerImageContainer>
            <Icon type={'ledger-icon-lg'} />
          </LedgerImageContainer>
          {state.error && (
            <ErrorMessageContainer>
              <InlineMessage
                type={InlineMessageType.ERROR}
                value={`${translateRaw('GENERIC_HARDWARE_ERROR')} ${state.error.message}`}
              />
            </ErrorMessageContainer>
          )}
          {state.isConnecting ? (
            <div className="LedgerPanel-loading">
              <Spinner /> {translate('WALLET_UNLOCKING')}
            </div>
          ) : (
            <LedgerConnectBtn onClick={() => handleNullConnect()} disabled={state.isConnecting}>
              {translate('ADD_LEDGER_SCAN')}
            </LedgerConnectBtn>
          )}
        </LedgerDescription>
        <LedgerFooter>
          {translate('LEDGER_REFERRAL_2', { $url: EXT_URLS.LEDGER_REFERRAL.url })}
          <br />
          <Trans
            id="USE_OLD_INTERFACE"
            variables={{
              $link: () => (
                <RouterLink to="/add-account/ledger_nano_s">
                  {translateRaw('TRY_OLD_INTERFACE')}
                </RouterLink>
              )
            }}
          />
        </LedgerFooter>
      </LedgerContent>
    </LedgerPanel>
  </Box>
);

export default LedgerDecrypt;
