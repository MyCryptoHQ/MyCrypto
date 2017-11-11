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
  defaultNonce: string | null;
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

    if (defaultNonce) {
      onChange(defaultNonce);
    }

    this.state = defaultNonce
      ? { nonce: defaultNonce, validNonce: true }
      : { nonce: '', validNonce: false };
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
