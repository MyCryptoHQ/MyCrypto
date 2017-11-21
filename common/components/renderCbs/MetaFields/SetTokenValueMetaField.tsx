import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTokenBalance, TSetTokenBalance } from 'actions/transaction';

interface DispatchProps {
  setTokenBalance: TSetTokenBalance;
}
interface SetterProps {
  withTokenBalanceSetter(
    setter: TSetTokenBalance
  ): React.ReactElement<any> | null;
}

class SetTokenValueMetaFieldClass extends Component<
  DispatchProps & SetterProps
> {
  public render() {
    return this.props.withTokenBalanceSetter(this.props.setTokenBalance);
  }
}

export const SetTokenValueMetaField = connect(null, { setTokenBalance })(
  SetTokenValueMetaFieldClass
);
