import React, { useContext, useState } from 'react';
//import styled from 'styled-components';

import { FormData, WalletId, ExtendedAsset } from '@types';
import { NetworkContext, getNetworkById, getAssetByUUID, AssetContext } from '@services/Store';
import { useDeterministicWallet } from '@services/WalletService';
import translate, { translateRaw, Trans } from '@translations';
import { NewTabLink, Spinner, Button, DeterministicAccountList } from '@components';
import { EXT_URLS, DPathsList } from '@config';

import UnsupportedNetwork from './UnsupportedNetwork';
import './LedgerNano.scss';
import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// const WalletService = WalletFactory(WalletId.LEDGER_NANO_S);

const LedgerDecrypt = ({ formData /*onUnlock*/ }: OwnProps) => {
  const dpaths = [DPathsList.ETH_LEDGER_LIVE, DPathsList.ETH_LEDGER]; //, NewDPathsList.ETH_LEDGER
  const numOfAccountsToCheck = 10;

  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const [assetToUse] = useState(baseAsset);
  const { state, requestConnection } = useDeterministicWallet(
    network,
    assetToUse,
    dpaths,
    numOfAccountsToCheck,
    WalletId.LEDGER_NANO_S_NEW
  );
  const handleNullConnect = () => {
    requestConnection();
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

  if (state.isConnected && state.accounts) {
    console.debug('back here: ', state.accounts);
    return (
      <div className="Mnemonic-dpath">
        <DeterministicAccountList
          accounts={state.accounts}
          totalAccounts={dpaths.length * numOfAccountsToCheck}
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
