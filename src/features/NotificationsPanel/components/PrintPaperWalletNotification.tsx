import React from 'react';

import styled from 'styled-components';

import walletIcon from '@assets/images/icn-wallet.svg';
import { PrintPaperWalletButton } from '@components';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';

import NotificationWrapper from './NotificationWrapper';

const { SCREEN_XS } = BREAK_POINTS;

const ResourceItem = styled.div`
  width: 200px;

  button {
    width: 100%;
    font-weight: normal;
    font-size: 17px;
    padding-left: 0px;
    padding-right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: ${SCREEN_XS}) {
      font-size: 15px;
    }
  }

  a {
    margin: 0;
  }
`;

interface Props {
  address: string;
  privateKey: string;
}

export default function PrintPaperWalletNotification({ address, privateKey }: Props) {
  return (
    <NotificationWrapper
      leftImg={{ src: walletIcon, width: '100px', height: 'auto', marginRight: '18px' }}
      title={translate('NOTIFICATIONS_PRINT_WALLET_TITLE')}
      description={translate('NOTIFICATIONS_PRINT_WALLET_DESCRIPTION')}
      resources={
        <ResourceItem>
          <PrintPaperWalletButton
            address={address}
            privateKey={privateKey}
            printText={translate('NOTIFICATIONS_PRINT_WALLET_RESOURCE')}
          />
        </ResourceItem>
      }
    />
  );
}
