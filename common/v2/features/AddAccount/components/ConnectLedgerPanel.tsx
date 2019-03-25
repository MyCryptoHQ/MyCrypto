import React, { Component } from 'react';
import { ContentPanel } from 'v2/components';
import { Typography, Panel } from '@mycrypto/ui';

import LedgerNanoIcon from 'common/assets/images/icn-ledger-nano.svg';
import styled from 'styled-components';

const Title = styled(Typography)`
  width: 421px;
  height: 78px;
  font-family: Lato;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--dark-slate-blue);
`;

const BodyText = styled(Typography)`
  width: 421px;
  height: 54px;
  font-family: Lato;
  font-size: 18px;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #333333;
`;

export default class ConnectLedgerPanel extends Component {
  public render() {
    return (
      <Panel>
        <Title>Connect and Unlock Your Ledger</Title>
        <BodyText>
          After you have connected, follow the instructions on screen to access your account.
        </BodyText>
        <img src={LedgerNanoIcon} />
      </Panel>
    );
  }
}
