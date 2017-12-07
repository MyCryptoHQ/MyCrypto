import { NonceInput } from './NonceInput';
import { inputNonce, TInputNonce } from 'actions/transaction';

import React from 'react';
import { connect } from 'react-redux';

interface OwnProps {
  defaultNonce: Promise<string | null>;
}
interface DispatchProps {
  inputNonce: TInputNonce;
}

type Props = OwnProps & DispatchProps;

class DefaultNonceInputClass extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { defaultNonce } = this.props;
    const networkNonce = await defaultNonce;

    if (networkNonce) {
      this.props.inputNonce(networkNonce);
    }
  }

  public render() {
    return <NonceInput onChange={this.setNonce} />;
  }

  private setNonce = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.inputNonce(value);
  };
}

export const DefaultNonceInput = connect(null, { inputNonce })(DefaultNonceInputClass);
