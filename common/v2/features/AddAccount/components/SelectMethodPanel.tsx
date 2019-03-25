import React, { Component } from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import { ContentPanel } from 'v2/components';
import styled from 'styled-components';
import LedgerNanoLogo from 'common/assets/images/ledger.png';
import ConnectLedger from 'common/v2/features/AddAccount/components/ConnectLedgerPanel';
import { ImportAddAccountStages } from '.././constants';
import { PanelProps } from '@mycrypto/ui/dist/atoms/Panel/Panel';
import { HardwareWalletName, SecureWalletName, InsecureWalletName, MiscWalletName } from 'config';
import {
  SecureWalletInfo,
  InsecureWalletInfo,
  MiscWalletInfo
} from 'components/WalletDecrypt/WalletDecrypt';

const WalletLabel = styled(Typography)`
  width: 90px;
  height: 22px;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: var(--dark-slate-blue);
`;

type HardwareWallets = { [key in HardwareWalletName]: SecureWalletInfo };
type SecureWallets = { [key in SecureWalletName]: SecureWalletInfo };
type InsecureWallets = { [key in InsecureWalletName]: InsecureWalletInfo };
type MiscWallet = { [key in MiscWalletName]: MiscWalletInfo };
type Wallets = HardwareWallets & SecureWallets & InsecureWallets & MiscWallet;

interface SelectMethodPanelProps {
  handlePanelClick: (wallet: keyof Wallets) => void;
}

export default class SelectMethodPanel extends Component<SelectMethodPanelProps> {
  public state: State = {
    selectedWalletKey: null
  };

  public handleWalletChoice() {
    this.setState({ stage: ImportAddAccountStages.ConnectLedger });
  }
  public render() {
    return (
      <section className="SelectMethodPanel">
        Select Method
        <Panel id={'ledgerwallet'} onClick={() => this.props.handlePanelClick('')}>
          <img src={LedgerNanoLogo} />
          <WalletLabel>Ledger</WalletLabel>
        </Panel>
      </section>
    );
  }
}
