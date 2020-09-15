import React from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import walletIcon from '@assets/images/icn-new-wallet.svg';
import { EXT_URLS } from '@config';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';

import NotificationWrapper from './NotificationWrapper';

const { SCREEN_XS } = BREAK_POINTS;

const ResourceItem = styled(Button)`
  width: 200px;
  font-weight: normal;
  font-size: 17px;
  padding-left: 0px;
  padding-right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 15px;
    width: 128px;
    margin-left: 15px;
    margin-right: 15px;
  }
`;

interface ResourceItemWrapperProps {
  title: React.ReactElement<any>;
  link: string;
}

const ResourceItemWrapper: React.FC<ResourceItemWrapperProps> = ({ title, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <ResourceItem secondary={true}>{title}</ResourceItem>
    </a>
  );
};

const getResources = () => {
  return (
    <>
      <ResourceItemWrapper
        title={translate('NOTIFICATIONS_GET_WALLET_RESOURCE_TREZOR')}
        link={EXT_URLS.TREZOR_REFERRAL.url}
      />
      <ResourceItemWrapper
        title={translate('NOTIFICATIONS_GET_WALLET_RESOURCE_LEDGER')}
        link={EXT_URLS.LEDGER_REFERRAL.url}
      />
    </>
  );
};

export default function GetHardwareWalletNotification() {
  return (
    <NotificationWrapper
      leftImg={{ src: walletIcon, width: '73px', height: '80px' }}
      title={translate('NOTIFICATIONS_GET_WALLET_TITLE')}
      description={translate('NOTIFICATIONS_GET_WALLET_DESCRIPTION')}
      resources={getResources()}
    />
  );
}
