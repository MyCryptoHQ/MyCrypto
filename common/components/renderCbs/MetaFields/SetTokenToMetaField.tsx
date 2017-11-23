import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TSetTokenTo,
  setTokenTo,
  SetTokenToMetaAction
} from 'actions/transaction';

type TokenToSetter = (payload: SetTokenToMetaAction['payload']) => void;
interface DispatchProps {
  setTokenTo: TSetTokenTo;
}
interface SetterProps {
  withTokenToSetter(setter: TokenToSetter): React.ReactElement<any> | null;
}

class SetTokenToMetaFieldClass extends Component<DispatchProps & SetterProps> {
  public render() {
    return this.props.withTokenToSetter(this.props.setTokenTo);
  }
}

export const SetTokenToMetaField = connect(null, { setTokenTo })(
  SetTokenToMetaFieldClass
);
