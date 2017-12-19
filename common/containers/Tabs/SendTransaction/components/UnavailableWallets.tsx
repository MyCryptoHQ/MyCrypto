import React, { Component } from 'react';
import { OnlyUnlocked } from 'components/renderCbs';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  shouldDisplay: boolean;
}

const content = (
  <div className="Tab-content-pane">
    <h4>Sorry...</h4>
    <p>MetaMask / Mist wallets are not available in offline mode.</p>
  </div>
);

class UnavailableWalletsClass extends Component<StateProps> {
  public render() {
    return <OnlyUnlocked whenUnlocked={this.props.shouldDisplay ? content : null} />;
  }
}

export const UnavailableWallets = connect((state: AppState) => ({
  shouldDisplay: isAnyOfflineWithWeb3(state)
}))(UnavailableWalletsClass);
