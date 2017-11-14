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
}
interface SetterProps {
  name: FieldNames;
  withFieldSetter(setter: FieldSetter): React.ReactElement<any> | null;
}

class SetTransactionFieldsClass extends Component<SetterProps & ReduxProps> {
  public render() {
    return this.props.withFieldSetter(this.fieldSetter);
  }
  private fieldSetter = (payload: TransactionFieldPayloadedAction['payload']) =>
    this.props[`set${upperFirst(this.props.name)}Field`](payload);
}

export const SetTransactionFields = connect(null, {
  setGasLimitField,
  setDataField,
  setAddressField,
  setNonceField,
  setAmountField
})(SetTransactionFieldsClass);
