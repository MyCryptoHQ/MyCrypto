import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { Web3Wallet } from 'libs/wallet';

type IWallet = AppState['wallet'];

interface Props {
  wallet: IWallet;
  withWallet({
    wallet,
    isWeb3Wallet
  }: {
    wallet: IWallet;
    isWeb3Wallet: boolean;
  }): React.ReactElement<any> | null;
}

class WalletClass extends React.Component<Props, {}> {
  public render() {
    const { wallet, withWallet } = this.props;
    const isWeb3Wallet = wallet.inst instanceof Web3Wallet;

    return withWallet({ wallet, isWeb3Wallet });
  }
}

export const Wallet = connect((state: AppState) => ({
  wallet: state.wallet
}))(WalletClass);
