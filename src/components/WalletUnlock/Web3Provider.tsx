import React, { FC, useCallback, useContext, useState } from 'react';
import translate, { translateRaw } from '@translations';
import { WALLETS_CONFIG, IWalletConfig } from '@config';
import { WalletId, FormData, Network } from '@types';
import { InlineMessage, NewTabLink } from '@components';
import { hasWeb3Provider, useAnalytics, useScreenSize } from '@utils';
import { SettingsContext, NetworkContext, NetworkUtils } from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import { FormDataActionType as ActionType } from '@features/AddAccount/types';
import { getWeb3Config } from '@utils/web3';
import { ANALYTICS_CATEGORIES } from '@services';

import './Web3Provider.scss';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: object;
  isMobile: boolean;
  onUnlock(param: any): void;
}

const WalletService = WalletFactory(WalletId.WEB3);

const Web3ProviderDecrypt: FC<Props> = ({ formData, formDispatch, onUnlock }) => {
  const { isMobile } = useScreenSize();
  const { updateSettingsNode } = useContext(SettingsContext);
  const { addNodeToNetwork, networks } = useContext(NetworkContext);
  const trackSelectNetwork = useAnalytics({
    category: ANALYTICS_CATEGORIES.ADD_WEB3_ACCOUNT
  });
  const [web3ProviderSettings] = useState<IWalletConfig>(() => {
    if (hasWeb3Provider()) {
      return getWeb3Config();
    }
    return WALLETS_CONFIG[WalletId.WEB3]; //Default to Web3
  });
  const [web3Unlocked, setWeb3Unlocked] = useState<boolean | undefined>(undefined);

  const unlockWallet = useCallback(async () => {
    const handleUnlock = (network: Network) => {
      updateSettingsNode('web3');
      addNodeToNetwork(NetworkUtils.createWeb3Node(), network);
    };

    try {
      const walletPayload = await WalletService.init(networks, handleUnlock);
      if (!walletPayload) {
        throw new Error('Failed to unlock web3 wallet');
      }
      // If accountType is defined, we are in the AddAccountFlow
      if (formData.accountType) {
        trackSelectNetwork({
          actionName: `${web3ProviderSettings.name} added`
        });

        const network = walletPayload.network;
        formDispatch({
          type: ActionType.SELECT_NETWORK,
          payload: { network }
        });
      }
      onUnlock(walletPayload);
    } catch (e) {
      setWeb3Unlocked(false);
    }
  }, [updateSettingsNode, addNodeToNetwork, formData, formDispatch, setWeb3Unlocked]);

  const isDefault = web3ProviderSettings.id === WalletId.WEB3;
  const transProps = { $walletId: web3ProviderSettings.name };

  return (
    <div className="Panel">
      <div className="Panel-title">
        {isDefault
          ? translate('ADD_ACCOUNT_WEB3_TITLE_DEFAULT', transProps)
          : translate('ADD_ACCOUNT_WEB3_TITLE', transProps)}
      </div>
      <div className="Panel-description">{translate(`ADD_ACCOUNT_WEB3_DESC`)}</div>
      <div className="Panel-content">
        <div className="Web3-img-container">
          <div className={isDefault ? 'Web3-img-default' : 'Web3-img'}>
            <img src={web3ProviderSettings.icon} />
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block" onClick={unlockWallet}>
          {isDefault
            ? translate('ADD_WEB3_DEFAULT', transProps)
            : translate('ADD_WEB3', transProps)}
        </button>

        {web3Unlocked === false && (
          <InlineMessage>{translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', transProps)}</InlineMessage>
        )}
      </div>
      <div className="Web3-footer">
        <div>
          {isDefault
            ? translate('ADD_ACCOUNT_WEB3_FOOTER_DEFAULT', transProps)
            : translate('ADD_ACCOUNT_WEB3_FOOTER', transProps)}{' '}
          <NewTabLink
            content={translate(`ADD_ACCOUNT_WEB3_FOOTER_LINK`, transProps)}
            href={
              web3ProviderSettings.install
                ? web3ProviderSettings.install.getItLink
                : isMobile
                ? translateRaw('ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_MOBILE')
                : translateRaw(`ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_DESKTOP`)
            }
          />
        </div>
        <div>
          <NewTabLink
            content={translate('ADD_ACCOUNT_WEB3_HELP', transProps)}
            href={`${web3ProviderSettings.helpLink}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Web3ProviderDecrypt;
