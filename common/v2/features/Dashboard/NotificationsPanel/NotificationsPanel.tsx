import React, { Component } from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { WalletCreatedNotification } from './components';
import { BREAK_POINTS } from 'v2/features/constants';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';

const { SCREEN_MD } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  position: relative;
  margin-left: 15px;
  margin-right: 15px;

  @media (min-width: ${SCREEN_MD}) {
    margin: 0 0 50px 0;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: 17px;
  top: 6px;
  img {
    width: 13px;
    height: 13px;
  }
`;

class NotificationsPanel extends Component {
  public state = {
    isOpen: true
  };

  public render() {
    const { isOpen } = this.state;

    return (
      isOpen && (
        <MainPanel>
          <CloseButton basic={true} onClick={this.onClose}>
            <img src={closeIcon} alt="Close" />
          </CloseButton>
          {this.getFirstVisibleNotification()}
        </MainPanel>
      )
    );
  }

  private onClose = () => {
    this.setState({ isOpen: false });
  };

  private getFirstVisibleNotification() {
    return <WalletCreatedNotification />;
  }
}

export default NotificationsPanel;
