import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'translations';
import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';

// Legacy
import walletIcon from 'common/assets/images/icn-wallet.svg';
import printerIcon from 'common/assets/images/icn-printer.svg';

const { SCREEN_XS } = BREAK_POINTS;

const WalletImage = styled.img`
  width: 100px;
  height: 81px;
  margin-right: 18px;
`;

const PrinterImage = styled.embed`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const ResourceItem = styled(Button)`
  width: 200px;
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

  &:hover {
    embed {
      filter: brightness(0) invert(1);
    }
  }
`;

export default function PrintPaperWalletNotification() {
  return (
    <NotificationWrapper
      leftImg={<WalletImage src={walletIcon} />}
      title={translate('NOTIFICATIONS_PRINT_WALLET_TITLE')}
      description={translate('NOTIFICATIONS_PRINT_WALLET_DESCRIPTION')}
      resources={
        <ResourceItem secondary={true}>
          <PrinterImage src={printerIcon} />
          {translate('NOTIFICATIONS_PRINT_WALLET_RESOURCE')}
        </ResourceItem>
      }
    />
  );
}
