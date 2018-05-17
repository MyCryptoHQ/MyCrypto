import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'redux/reducers';
import { isUnlocked } from 'redux/wallet/selectors';

interface OwnProps {
  whenUnlocked: React.ReactElement<any> | null;
}

interface StateProps {
  isUnlocked: boolean;
}

function mapStateToProps(state: AppState) {
  return {
    isUnlocked: isUnlocked(state)
  };
}

class OnlyUnlockedClass extends Component<OwnProps & StateProps> {
  public render() {
    return this.props.isUnlocked ? this.props.whenUnlocked : null;
  }
}

export const OnlyUnlocked = connect(mapStateToProps)(OnlyUnlockedClass);
