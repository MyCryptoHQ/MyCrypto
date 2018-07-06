import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { walletSelectors } from 'features/wallet';
import { getNetworkConfig } from 'features/config';
import { configureLiteSend, TConfigureLiteSend } from 'features/swap/actions';
import { shouldDisplayLiteSend } from 'features/swap/selectors';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { OnlyUnlocked } from 'components/renderCbs';
import { Fields } from './Fields';

interface DispatchProps {
  configureLiteSend: TConfigureLiteSend;
}

interface StateProps {
  shouldDisplay: boolean;
  isUnlocked: boolean;
  network: NetworkConfig;
}

type Props = StateProps & DispatchProps;
class LiteSendClass extends Component<Props> {
  public componentDidMount() {
    this.props.configureLiteSend();
  }

  public render() {
    if (!this.props.shouldDisplay) {
      return null;
    }
    const { network, isUnlocked } = this.props;
    let renderMe;
    if (network.chainId !== 1) {
      renderMe = (
        <div className="row">
          <div className="col-xs-8 col-xs-push-2 text-center">
            <h5>Note: Send is only supported on Ethereum Mainnet.</h5>
          </div>
        </div>
      );
    } else {
      renderMe = isUnlocked ? (
        <OnlyUnlocked whenUnlocked={<Fields />} />
      ) : (
        <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} />
      );
    }

    return <React.Fragment>{renderMe}</React.Fragment>;
  }
}

export const LiteSend = connect(
  (state: AppState) => ({
    shouldDisplay: shouldDisplayLiteSend(state),
    isUnlocked: walletSelectors.isUnlocked(state),
    network: getNetworkConfig(state)
  }),
  { configureLiteSend }
)(LiteSendClass);
