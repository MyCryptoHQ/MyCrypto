import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { nonStandardTransaction } from 'selectors/transaction';

interface Props {
  isNonStandard: boolean;
}

class NonStandardTransactionClass extends Component<Props> {
  public render() {
    return this.props.isNonStandard ? (
      <h5 style={{ color: 'red' }}>
        WARNING: This is a non standard transaction, it contains data!
      </h5>
    ) : null;
  }
}

export const NonStandardTransaction = connect((state: AppState) => ({
  isNonStandard: nonStandardTransaction(state)
}))(NonStandardTransactionClass);
