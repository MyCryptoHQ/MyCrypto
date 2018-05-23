import React, { Component } from 'react';
import translate from 'translations';
import { OnlyUnlocked } from 'components/renderCbs';
import { isAnyOfflineWithWeb3 } from 'selectors/derived';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  shouldDisplay: boolean;
}

const content = (
  <div className="Tab-content-pane">
    <h4>{translate('SORRY')}...</h4>
    <p>{translate('WEB3_UNAVAILABLE_OFFLINE')}</p>
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
