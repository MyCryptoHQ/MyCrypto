import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { TransactionFieldPayloadedAction } from 'actions/transactionFields';
import { upperFirst } from 'lodash';
import {
  setGasLimitField,
  setDataField,
  setAddressField,
  setNonceField,
  setAmountField,
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField
} from 'actions/transactionFields/actionCreators';

type FieldNames = keyof AppState['transactionFields'];
type FieldSetter = (
  payload: TransactionFieldPayloadedAction['payload']
) => void;
interface ReduxProps {
  setGasLimitField: TSetGasLimitField;
  setDataField: TSetDataField;
  setAddressField: TSetToField;
  setNonceField: TSetNonceField;
  setAmountField: TSetValueField;
  transactionFields: AppState['transactionFields'];
}
interface SetterProps {
  name: FieldNames;
  withFieldSetter(setter: FieldSetter): React.ReactElement<any> | null;
}
interface GetterProps {
  withFieldValues(
    values: AppState['transactionFields']
  ): React.ReactElement<any> | null;
}
type Props = SetterProps | GetterProps;

class TransactionFieldsClass extends Component<Props & ReduxProps> {
  public render() {
    return this.setterSupplied(this.props)
      ? this.props.withFieldSetter(this.fieldSetter)
      : this.props.withFieldValues(this.props.transactionFields);
  }
  private fieldSetter = (
    payload: TransactionFieldPayloadedAction['payload']
  ) => {
    if (this.setterSupplied(this.props)) {
      this.props[`set${upperFirst(this.props.name)}Field`](payload);
    } else {
      throw Error('No setter or field name supplied');
    }
  };

  private setterSupplied = (props: Props): props is SetterProps =>
    !!(props as SetterProps).withFieldSetter && !!(props as SetterProps).name;
}

export const TransactionFields = connect(
  (state: AppState) => ({
    transactionFields: state.transactionFields
  }),
  {
    setGasLimitField,
    setDataField,
    setAddressField,
    setNonceField,
    setAmountField
  }
)(TransactionFieldsClass);
