import React, { Component } from 'react';
import Keystore from './components/Keystore';
import Mnemonic from './components/Mnemonic';
import WalletTypes from './components/WalletTypes';
import CryptoWarning from './components/CryptoWarning';
import TabSection from 'containers/TabSection';
import { RouteComponentProps } from 'react-router-dom';

export enum WalletType {
  Keystore = 'keystore',
  Mnemonic = 'mnemonic'
}

export default class GenerateWallet extends Component<RouteComponentProps<{}>> {
  public render() {
    const walletType = this.props.location.pathname.split('/')[2];
    let content;

    if (window.crypto) {
      if (walletType === WalletType.Mnemonic) {
        content = <Mnemonic />;
      } else if (walletType === WalletType.Keystore) {
        content = <Keystore />;
      } else {
        content = <WalletTypes />;
      }
    } else {
      content = <CryptoWarning />;
    }

    return (
      <TabSection>
        <section className="Tab-content">{content}</section>
      </TabSection>
    );
  }
}
