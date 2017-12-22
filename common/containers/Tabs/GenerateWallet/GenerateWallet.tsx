import React, { Component } from 'react';
import Keystore from './components/Keystore';
import Mnemonic from './components/Mnemonic';
import WalletTypes from './components/WalletTypes';
import CryptoWarning from './components/CryptoWarning';
import TabSection from 'containers/TabSection';

export enum WalletType {
  Keystore = 'keystore',
  Mnemonic = 'mnemonic'
}

interface State {
  walletType: WalletType | null;
}

export default class GenerateWallet extends Component<{}, State> {
  public state = {
    walletType: null
  };

  public render() {
    const { walletType } = this.state;
    let content;

    if (window.crypto) {
      if (walletType === WalletType.Mnemonic) {
        content = <Mnemonic />;
      } else if (walletType === WalletType.Keystore) {
        content = <Keystore />;
      } else {
        content = <WalletTypes onSelect={this.changeWalletType} />;
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

  private changeWalletType = (walletType: WalletType) => {
    this.setState({ walletType });
  };
}
