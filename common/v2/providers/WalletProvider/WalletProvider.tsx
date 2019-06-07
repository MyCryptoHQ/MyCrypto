import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Wallets/Wallets';
import { Wallet, ExtendedWallet } from 'v2/services/Wallets';

export interface ProviderState {
  wallets: ExtendedWallet[];
  createWallet(walletData: ExtendedWallet): void;
  readWallet(uuid: string): Wallet;
  deleteWallet(uuid: string): void;
  updateWallet(uuid: string, walletData: ExtendedWallet): void;
}

export const WalletContext = createContext({} as ProviderState);

export class WalletProvider extends Component {
  public readonly state: ProviderState = {
    wallets: service.readWallets() || [],
    createWallet: (walletData: ExtendedWallet) => {
      service.createWallet(walletData);
      this.getWallets();
    },
    readWallet: (uuid: string) => {
      return service.readWallet(uuid);
    },
    deleteWallet: (uuid: string) => {
      service.deleteWallet(uuid);
      this.getWallets();
    },
    updateWallet: (uuid: string, walletData: ExtendedWallet) => {
      service.updateWallet(uuid, walletData);
      this.getWallets();
    }
  };

  public render() {
    const { children } = this.props;
    return <WalletContext.Provider value={this.state}>{children}</WalletContext.Provider>;
  }

  private getWallets = () => {
    const wallets: ExtendedWallet[] = service.readWallets() || [];
    this.setState({ wallets });
  };
}
