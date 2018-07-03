import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sanitizeNumericalInput } from 'libs/values';
import { AppState } from 'features/reducers';
import { transactionFieldsActions } from 'features/transaction';
import { NonceInputFactory } from './NonceInputFactory';

export interface CallbackProps {
  nonce: AppState['transaction']['fields']['nonce'];
  readOnly: boolean;
  shouldDisplay: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

interface DispatchProps {
  inputNonce: transactionFieldsActions.TInputNonce;
}

interface OwnProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & DispatchProps;

class NonceFieldClass extends Component<Props> {
  public render() {
    return <NonceInputFactory onChange={this.setNonce} withProps={this.props.withProps} />;
  }

  private setNonce = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputNonce(sanitizeNumericalInput(value));
  };
}

export const NonceFieldFactory = connect(null, {
  inputNonce: transactionFieldsActions.inputNonce
})(NonceFieldClass);
