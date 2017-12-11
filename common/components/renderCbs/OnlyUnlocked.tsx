import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isUnlocked } from 'selectors/wallet';
import { AppState } from 'reducers';

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
