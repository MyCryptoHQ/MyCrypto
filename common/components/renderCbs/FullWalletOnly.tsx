import * as React from 'react';
import { connect } from 'react-redux';

import { IWallet, IFullWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';

interface Props {
  wallet: IWallet;
  withFullWallet(wallet: IFullWallet): React.ReactElement<any>;
  withoutFullWallet(): React.ReactElement<any>;
}

class FullWalletOnly extends React.Component<Props, {}> {
  public render() {
    const { wallet, withFullWallet, withoutFullWallet } = this.props;
    if (!wallet || wallet.isReadOnly) {
      if (withoutFullWallet) {
        return withoutFullWallet();
      }
      return null;
    }
    return withFullWallet(wallet);
  }
}

export default connect((state: AppState) => ({
  wallet: state.wallet.inst
}))(FullWalletOnly);
