import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { walletSelectors } from 'features/wallet';

interface OwnProps {
  whenUnlocked: React.ReactElement<any> | null;
}

interface StateProps {
  isUnlocked: boolean;
}

function mapStateToProps(state: AppState) {
  return {
    isUnlocked: walletSelectors.isUnlocked(state)
  };
}

class OnlyUnlockedClass extends Component<OwnProps & StateProps> {
  public render() {
    return this.props.isUnlocked ? this.props.whenUnlocked : null;
  }
}

export const OnlyUnlocked = connect(mapStateToProps)(OnlyUnlockedClass);
