import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TSetDecimalMeta, setDecimalMeta } from 'actions/transaction';

type DecimalSetter = (decimal: number) => void;
interface DispatchProps {
  setDecimalMeta: TSetDecimalMeta;
}
interface SetterProps {
  withDecimalSetter(setter: DecimalSetter): React.ReactElement<any> | null;
}

class SetDecimalMetaFieldClass extends Component<DispatchProps & SetterProps> {
  public render() {
    return this.props.withDecimalSetter(this.props.setDecimalMeta);
  }
}

export const SetDecimalMetaField = connect(null, { setDecimalMeta })(
  SetDecimalMetaFieldClass
);
