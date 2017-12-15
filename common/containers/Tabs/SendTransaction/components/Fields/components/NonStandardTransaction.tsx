import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { nonValueTransaction } from 'selectors/transaction';

interface Props {
  isNonStandard: boolean;
}

class NonStandardTransactionClass extends Component<Props> {
  public render() {
    return this.props.isNonStandard ? (
      <h5 style={{ color: 'red' }}>This is a non standard transaction, no ether will be sent</h5>
    ) : null;
  }
}

export const NonStandardTransaction = connect((state: AppState) => ({
  isNonStandard: nonValueTransaction(state)
}))(NonStandardTransactionClass);
