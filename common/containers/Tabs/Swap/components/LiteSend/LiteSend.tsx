import React, { Component } from 'react';
import WalletDecrypt from 'components/WalletDecrypt';
import { OnlyUnlocked } from 'components/renderCbs';
import { Fields } from './Fields';
import { isUnlocked as isUnlockedSelector } from 'selectors/wallet';
import { getNetworkConfig } from 'selectors/config';
import { configureLiteSend, TConfigureLiteSend } from 'actions/swap';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { shouldDisplayLiteSend } from 'selectors/swap';
import { NetworkConfig } from 'config';

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
      renderMe = isUnlocked ? <OnlyUnlocked whenUnlocked={<Fields />} /> : <WalletDecrypt />;
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
