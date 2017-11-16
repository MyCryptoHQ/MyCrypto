import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { TypeKeys, FieldAction } from 'actions/transaction';

interface ReduxProps {
  transactionFields: AppState['transaction']['fields'];
}

interface IValid {
  valid: boolean;
}

type MergeValid<T> = { [P in keyof T]: T[P] & IValid };

interface Props {
  withFieldValues(
    values: MergeValid<AppState['transaction']['fields']>
  ): React.ReactElement<any> | null;
}

class GetTransactionFieldsClass extends Component<Props & ReduxProps, {}> {
  public render() {
    return this.props.withFieldValues(this.getMergedProps());
  }

  private getMergedProps = (): MergeValid<
    AppState['transaction']['fields']
  > => {
    const { transactionFields } = this.props;

    return Object.keys(transactionFields).reduce((obj, currField: TypeKeys) => {
      const prop: FieldAction['payload'] = transactionFields[currField];
      const valid = !!prop.value;
      const mergedProp = { ...prop, valid };
      return { ...obj, [currField]: mergedProp };
    }, {}) as MergeValid<AppState['transaction']['fields']>;
  };
}

export const GetTransactionFields = connect((state: AppState) => ({
  transactionFields: state.transaction.fields
}))(GetTransactionFieldsClass);
