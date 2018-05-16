import React, { Component } from 'react';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { OnlyUnlocked } from 'components/renderCbs';
import { Fields } from './Fields';
import { isUnlocked as isUnlockedSelector } from 'redux/wallet';
import { getNetworkConfig } from 'redux/config';
import { configureLiteSend, TConfigureLiteSend, shouldDisplayLiteSend } from 'redux/swap';
import { connect } from 'react-redux';
import { AppState } from 'redux/reducers';
import { NetworkConfig } from 'types/network';

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
    isUnlocked: isUnlockedSelector(state),
    network: getNetworkConfig(state)
  }),
  { configureLiteSend }
)(LiteSendClass);
