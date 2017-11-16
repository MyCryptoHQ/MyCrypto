import { isPositiveInteger } from 'utils/helpers';
import { NonceInput } from './NonceInput';
import { SetNonceFieldAction } from 'actions/transaction';

import { Nonce } from 'libs/units';
import React from 'react';

export interface Props {
  defaultNonce: Promise<string | null>;
  setter(payload: SetNonceFieldAction['payload']): void;
}

export class DefaultNonceInput extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { defaultNonce, setter } = this.props;
    const networkNonce = await defaultNonce;

    if (networkNonce) {
      const nonce = Nonce(networkNonce);
      setter({ raw: nonce.toString(), value: nonce });
    }
  }

  public render() {
    return <NonceInput onChange={this.setNonce} />;
  }

  private setNonce = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validNonce = this.isValidNonce(value);
    this.props.setter({ raw: value, value: validNonce ? Nonce(value) : null });
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
