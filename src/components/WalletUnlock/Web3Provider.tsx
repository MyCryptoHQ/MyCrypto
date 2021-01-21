import React, { FC, useCallback, useState } from 'react';

import { Box, Heading, InlineMessage, NewTabLink } from '@components';
import { Body } from '@components/NewTypography';
import { IWalletConfig, WALLETS_CONFIG } from '@config';
import { FormDataActionType as ActionType } from '@features/AddAccount/types';
import { NetworkUtils, useNetworks } from '@services/Store';
import { WalletFactory, Web3Wallet } from '@services/WalletService';
import translate, { translateRaw } from '@translations';
import { FormData, Network, WalletId } from '@types';
import { hasWeb3Provider, useScreenSize } from '@utils';
import { getWeb3Config } from '@utils/web3';

import './Web3Provider.scss';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: TObject;
  isMobile: boolean;
  onUnlock(param: Web3Wallet[]): void;
}

interface IWeb3UnlockError {
  error: boolean;
  message: string;
}
const WalletService = WalletFactory(WalletId.WEB3);

const Web3ProviderDecrypt: FC<Props> = ({ formData, formDispatch, onUnlock }) => {
  const { isMobile } = useScreenSize();
  const { addNodeToNetwork, networks } = useNetworks();
  const [web3ProviderSettings] = useState<IWalletConfig>(() => {
    if (hasWeb3Provider()) {
      return getWeb3Config();
    }
    return WALLETS_CONFIG[WalletId.WEB3]; //Default to Web3
  });

  const [web3Unlocked, setWeb3Unlocked] = useState<boolean | undefined>(undefined);
  const [web3UnlockError, setWeb3UnlockError] = useState<IWeb3UnlockError | undefined>(undefined);
  const unlockWallet = useCallback(async () => {
    const handleUnlock = (network: Network) => {
      if (!network.isCustom) {
        addNodeToNetwork(NetworkUtils.createWeb3Node(), network);
      }
    };

    try {
      const walletPayload: Web3Wallet[] | undefined = await WalletService.init(
        networks,
        handleUnlock
      );
      if (!walletPayload) {
        throw new Error('Failed to unlock web3 wallet');
      }
      // If accountType is defined, we are in the AddAccountFlow
      if (formData.accountType) {
        const network = walletPayload[0].network;
        formDispatch({
          type: ActionType.SELECT_NETWORK,
          payload: { network }
        });
      }
      onUnlock(walletPayload);
    } catch (e) {
      setWeb3UnlockError({ error: true, message: e.message });
      setWeb3Unlocked(false);
    }
  }, [addNodeToNetwork, formData, formDispatch, setWeb3Unlocked]);

  const isDefault = web3ProviderSettings.id === WalletId.WEB3;
  const transProps = { $walletId: web3ProviderSettings.name };

  return (
    <Box p="2.5em">
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {isDefault
          ? translate('ADD_ACCOUNT_WEB3_TITLE_DEFAULT', transProps)
          : translate('ADD_ACCOUNT_WEB3_TITLE', transProps)}
      </Heading>
      <Body textAlign="center" fontSize="2" paddingTop="16px">
        {translate(`ADD_ACCOUNT_WEB3_DESC`)}
      </Body>
      <Box m="2em">
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
          <>
            {web3UnlockError && web3UnlockError.error && (
              <InlineMessage>{web3UnlockError.message}</InlineMessage>
            )}
            <InlineMessage>{translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', transProps)}</InlineMessage>
          </>
        )}
      </Box>
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
    </Box>
  );
};

export default Web3ProviderDecrypt;
