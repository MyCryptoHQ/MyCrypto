import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface ReduxProps {
  transactionFields: AppState['transactionFields'];
}

interface GetterProps {
  withFieldValues(
    values: AppState['transactionFields']
  ): React.ReactElement<any> | null;
}

class GetTransactionFieldsClass extends Component<
  GetterProps & ReduxProps,
  {}
> {
  public render() {
    return this.props.withFieldValues(this.props.transactionFields);
  }
}

export const GetTransactionFields = connect((state: AppState) => ({
  transactionFields: state.transactionFields
}))(GetTransactionFieldsClass);
