import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'translations';
import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';
import { PaperWallet } from 'components';

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
  pointer-events: none;
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

const HiddenPaperWallet = styled.div`
  position: absolute;
  top: -1000px;
`;

interface Props {
  address: string;
  privateKey: string;
}

interface State {
  paperWalletImage: string;
}

export default class PrintPaperWalletNotification extends React.Component<Props, State> {
  public state: State = {
    paperWalletImage: ''
  };

  private paperWallet: PaperWallet | null;

  public componentDidMount() {
    setTimeout(() => {
      if (!this.paperWallet) {
        return this.componentDidMount();
      }

      this.paperWallet.toPNG().then(png => this.setState({ paperWalletImage: png }));
    }, 500);
  }

  public render() {
    const { paperWalletImage } = this.state;
    const { address, privateKey } = this.props;

    return (
      <NotificationWrapper
        leftImg={<WalletImage src={walletIcon} />}
        title={translate('NOTIFICATIONS_PRINT_WALLET_TITLE')}
        description={translate('NOTIFICATIONS_PRINT_WALLET_DESCRIPTION')}
        resources={
          <a href={paperWalletImage} download={`paper-wallet-0x${address.substr(0, 6)}`}>
            <ResourceItem disabled={!paperWalletImage} secondary={true}>
              <PrinterImage src={printerIcon} />
              {translate('NOTIFICATIONS_PRINT_WALLET_RESOURCE')}
            </ResourceItem>
          </a>
        }
      >
        <HiddenPaperWallet>
          <PaperWallet
            address={address}
            privateKey={privateKey}
            ref={c => (this.paperWallet = c)}
          />
        </HiddenPaperWallet>
      </NotificationWrapper>
    );
  }
}
