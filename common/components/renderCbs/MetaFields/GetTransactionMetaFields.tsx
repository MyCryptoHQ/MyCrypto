import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface ReduxProps {
  transactionMetaFields: AppState['transaction']['meta'];
}

interface Props {
  withFieldValues(
    values: AppState['transaction']['meta']
  ): React.ReactElement<any> | null;
}

class GetTransactionMetaFieldsClass extends Component<Props & ReduxProps, {}> {
  public render() {
    return this.props.withFieldValues(this.props.transactionMetaFields);
  }
}

export const GetTransactionMetaFields = connect((state: AppState) => ({
  transactionMetaFields: state.transaction.meta
}))(GetTransactionMetaFieldsClass);
