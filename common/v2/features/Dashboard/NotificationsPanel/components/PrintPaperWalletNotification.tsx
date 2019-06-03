import React from 'react';
import styled from 'styled-components';

import translate from 'translations';
import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';
import { PrintPaperWalletButton } from 'v2/components';

// Legacy
import walletIcon from 'common/assets/images/icn-wallet.svg';

const { SCREEN_XS } = BREAK_POINTS;

const ResourceItem = styled.div`
  button {
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
  }

  a {
    margin: 0;
  }
`;

interface Props {
  address: string;
  privateKey: string;
}

export default class PrintPaperWalletNotification extends React.Component<Props> {
  public render() {
    const { address, privateKey } = this.props;

    return (
      <NotificationWrapper
        leftImg={{ src: walletIcon, width: '100px', height: '81px', marginRight: '18px' }}
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
}
