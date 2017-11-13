import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

type IWallet = AppState['wallet'];

interface Props {
  wallet: IWallet;
  withWallet({ wallet }: { wallet: IWallet }): React.ReactElement<any> | null;
}

class WalletClass extends React.Component<Props, {}> {
  public render() {
    const { wallet, withWallet } = this.props;
    return withWallet({ wallet });
  }
}

export const Wallet = connect((state: AppState) => ({
  wallet: state.wallet
}))(WalletClass);
