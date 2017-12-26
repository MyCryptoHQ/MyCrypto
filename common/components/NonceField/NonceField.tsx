import { NonceInput } from './NonceInput';
import { inputNonce, TInputNonce } from 'actions/transaction';
import React, { Component } from 'react';
import { connect } from 'react-redux';

interface DispatchProps {
  inputNonce: TInputNonce;
}

class NonceFieldClass extends Component<DispatchProps> {
  public render() {
    return <NonceInput onChange={this.setNonce} />;
  }

  private setNonce = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputNonce(value);
  };
}

export const NonceField = connect(null, {
  inputNonce
})(NonceFieldClass);
