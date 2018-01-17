import { AppState } from 'reducers';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFrom } from 'selectors/transaction';

type From = AppState['transaction']['meta']['from'];
interface StateProps {
  from: From;
}
interface OwnProps {
  withFrom(from: string): React.ReactElement<any> | null;
}

class FromClass extends Component<StateProps & OwnProps, {}> {
  public render() {
    const { from, withFrom } = this.props;
    return from ? withFrom(from) : null;
  }
}

export const From = connect((state: AppState) => ({ from: getFrom(state) }))(FromClass);
