import { isPositiveInteger } from 'utils/helpers';
import { NonceInput } from './NonceInput';
import React from 'react';

const isValidNonce = (value: string | null | undefined): boolean => {
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

interface Props {
  defaultNonce: Promise<string | null>;
  onChange(nonce: string | null): void;
}

interface State {
  nonce: string;
  validNonce: boolean;
}

export class DefaultNonceInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { defaultNonce, onChange } = props;

    defaultNonce.then(nonce => {
      if (nonce) {
        onChange(nonce);
      }

      this.state = nonce
        ? { nonce, validNonce: true }
        : { nonce: '', validNonce: false };
    });
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
    const validNonce = isValidNonce(value);
    this.props.onChange(validNonce ? value : null);
    this.setState({ nonce: value, validNonce });
  };
}
