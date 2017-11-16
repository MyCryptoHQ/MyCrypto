import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TSetUnitMeta, setUnitMeta } from 'actions/transaction';

type UnitSetter = (decimal: string) => void;
interface DispatchProps {
  setUnitMeta: TSetUnitMeta;
}
interface SetterProps {
  withUnitSetter(setter: UnitSetter): React.ReactElement<any> | null;
}

class SetUnitMetaFieldClass extends Component<DispatchProps & SetterProps> {
  public render() {
    return this.props.withUnitSetter(this.props.setUnitMeta);
  }
}

export const SetUnitMetaField = connect(null, { setUnitMeta })(
  SetUnitMetaFieldClass
);
