import React, { FC, useCallback, useState } from 'react';

import styled from 'styled-components';

import { Box, Button, Heading, InlineMessage, NewTabLink, Web3ProviderInstall } from '@components';
import { Body } from '@components/NewTypography';
import { IWalletConfig, WALLETS_CONFIG } from '@config';
import { FormDataActionType as ActionType } from '@features/AddAccount/types';
import { useNetworks } from '@services/Store';
import { WalletFactory, Web3Wallet } from '@services/WalletService';
import { BREAK_POINTS } from '@theme';
import translate, { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { hasWeb3Provider, useScreenSize } from '@utils';
import { getWeb3Config } from '@utils/web3';

const Web3ImgContainer = styled.div`
  padding-bottom: 3em;
  display: flex;
  justify-content: center;
  align-content: center;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding-bottom: 1em;
  }
`;

const Web3Img = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 150px;
  & img {
    width: 150px;
  }
`;

const Footer = styled.div`
  text-align: center;
`;

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet?: TObject;
  isMobile?: boolean;
  onUnlock(param: Web3Wallet[]): void;
}

interface UnlockProps extends Props {
  isProviderPresent: boolean;
}

interface IWeb3UnlockError {
  error: boolean;
  message: string;
  errorTotal: any;
}
const WalletService = WalletFactory[WalletId.WEB3];

const Web3Unlock: FC<UnlockProps> = ({ isProviderPresent, formData, formDispatch, onUnlock }) => {
  const { isMobile } = useScreenSize();
  const { addNodeToNetwork, networks } = useNetworks();
  const [web3Unlocked, setWeb3Unlocked] = useState<boolean | undefined>(undefined);
  const [web3UnlockError, setWeb3UnlockError] = useState<IWeb3UnlockError | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const web3ProviderSettings = isProviderPresent ? getWeb3Config() : WALLETS_CONFIG[WalletId.WEB3];

  const unlockWallet = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const walletPayload: Web3Wallet[] | undefined = await WalletService.init({
        networks
      });
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
      setIsSubmitting(false);
      onUnlock(walletPayload);
    } catch (e) {
      setWeb3UnlockError({ error: true, message: e.message, errorTotal: e });
      setWeb3Unlocked(false);
      setIsSubmitting(false);
    }
  }, [addNodeToNetwork, formData, formDispatch, setWeb3Unlocked]);

  const isDefault = web3ProviderSettings.id === WalletId.WEB3;
  const transProps = { $walletId: web3ProviderSettings.name };

  return (
    <Web3UnlockUI
      isDefault={isDefault}
      transProps={transProps}
      web3Unlocked={web3Unlocked}
      web3UnlockError={web3UnlockError}
      web3ProviderSettings={web3ProviderSettings}
      isSubmitting={isSubmitting}
      isMobile={isMobile}
      unlockWallet={unlockWallet}
    />
  );
};

export interface Web3UnlockUIProps {
  isDefault: boolean;
  transProps: { $walletId: string };
  isMobile: boolean;
  web3ProviderSettings: IWalletConfig;
  isSubmitting: boolean;
  web3Unlocked?: boolean;
  web3UnlockError?: IWeb3UnlockError;
  unlockWallet(): void;
}

export const Web3UnlockUI = ({
  isDefault,
  transProps,
  web3Unlocked,
  isSubmitting,
  web3UnlockError,
  web3ProviderSettings,
  isMobile,
  unlockWallet
}: Web3UnlockUIProps) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {isDefault
        ? translate('ADD_ACCOUNT_WEB3_TITLE_DEFAULT', transProps)
        : translate('ADD_ACCOUNT_WEB3_TITLE', transProps)}
    </Heading>
    <Body textAlign="center" fontSize="2" paddingTop="16px">
      {translate(`ADD_ACCOUNT_WEB3_DESC`)}
    </Body>
    <Box m="2em" variant="columnCenter">
      <Web3ImgContainer>
        <Web3Img>
          <img src={web3ProviderSettings.icon} />
        </Web3Img>
      </Web3ImgContainer>
      <Button disabled={isSubmitting} onClick={unlockWallet}>
        {isSubmitting && translate('WALLET_UNLOCKING')}
        {!isSubmitting && isDefault && translate('ADD_WEB3_DEFAULT', transProps)}
        {!isSubmitting && !isDefault && translate('ADD_WEB3', transProps)}
      </Button>

      {web3Unlocked === false && (
        <>
          {web3UnlockError && web3UnlockError.error && (
            <InlineMessage>{web3UnlockError.message}</InlineMessage>
          )}
          <InlineMessage>{translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', transProps)}</InlineMessage>
        </>
      )}
    </Box>
    <Footer>
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
          href={web3ProviderSettings.helpLink}
        />
      </div>
    </Footer>
  </Box>
);

const Web3ProviderDecrypt: FC<Props> = ({ formData, formDispatch, onUnlock }) => {
  const [isProviderPresent, setIsProviderPresent] = useState(hasWeb3Provider());
  const tripProviderStatus = () => setIsProviderPresent(true);

  (window as any).addEventListener('ethereum#initialized', tripProviderStatus, {
    once: true
  });

  return isProviderPresent ? (
    <Web3Unlock
      isProviderPresent={isProviderPresent}
      formData={formData}
      formDispatch={formDispatch}
      onUnlock={onUnlock}
    />
  ) : (
    <Web3ProviderInstall />
  );
};

export default Web3ProviderDecrypt;
