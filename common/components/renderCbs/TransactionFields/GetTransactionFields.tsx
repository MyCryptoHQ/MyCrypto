import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  TypeKeys,
  TransactionFieldPayloadedAction
} from 'actions/transactionFields';

interface ReduxProps {
  transactionFields: AppState['transactionFields'];
}

interface IValid {
  valid: boolean;
}

type MergeValid<T> = { [P in keyof T]: T[P] & IValid };

interface Props {
  withFieldValues(
    values: MergeValid<AppState['transactionFields']>
  ): React.ReactElement<any> | null;
}

class GetTransactionFieldsClass extends Component<Props & ReduxProps, {}> {
  public render() {
    return this.props.withFieldValues(this.getMergedProps());
  }

  private getMergedProps = (): MergeValid<AppState['transactionFields']> => {
    const { transactionFields } = this.props;

    return Object.keys(transactionFields).reduce((obj, currField: TypeKeys) => {
      const prop: TransactionFieldPayloadedAction['payload'] =
        transactionFields[currField];
      const valid = !!prop.value;
      const mergedProp = { ...prop, valid };
      return { ...obj, [currField]: mergedProp };
    }, {}) as MergeValid<AppState['transactionFields']>;
  };
}

export const GetTransactionFields = connect((state: AppState) => ({
  transactionFields: state.transactionFields
}))(GetTransactionFieldsClass);
