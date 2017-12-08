import { CustomMessage, messages } from './components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getCurrentTo, ICurrentTo } from 'selectors/transaction';

interface StateProps {
  currentTo: ICurrentTo;
}
class CurrentCustomMessageClass extends Component<StateProps> {
  public render() {
    return <CustomMessage message={messages.find(m => m.to === this.props.currentTo.raw)} />;
  }
}

export const CurrentCustomMessage = connect((state: AppState) => ({
  currentTo: getCurrentTo(state)
}))(CurrentCustomMessageClass);
