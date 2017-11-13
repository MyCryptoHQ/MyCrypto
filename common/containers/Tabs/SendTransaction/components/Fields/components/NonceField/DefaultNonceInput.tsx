import { isPositiveInteger } from 'utils/helpers';
import { NonceInput } from './NonceInput';
import { Nonce } from 'libs/units';
import React from 'react';

export interface Props {
  defaultNonce: Promise<string | null>;
  onChange(nonce: Nonce | null): void;
}

interface State {
  nonce: string;
  validNonce: boolean;
}

export class DefaultNonceInput extends React.Component<Props, State> {
  public async componentDidMount() {
    const { defaultNonce, onChange } = this.props;
    const networkNonce = await defaultNonce;

    if (networkNonce) {
      onChange(Nonce(networkNonce));
    }

    const state: State = networkNonce
      ? { nonce: networkNonce, validNonce: true }
      : { nonce: '', validNonce: false };

    this.setState(state);
  }

  public render() {
    return (
      <NonceInput
        value={this.state.nonce}
        onChange={this.setNonce}
        validNonce={this.state.validNonce}
      />
    );
  }

  private setNonce = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validNonce = this.isValidNonce(value);
    this.props.onChange(validNonce ? Nonce(value) : null);
    this.setState({ nonce: value, validNonce });
  };

  private isValidNonce = (value: string | null | undefined): boolean => {
    let valid;
    if (value === '0') {
      valid = true;
    } else if (!value) {
      valid = false;
    } else {
      valid = isPositiveInteger(+value);
    }
    return valid;
  };
}
