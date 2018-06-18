import React from 'react';
import { Result } from 'mycrypto-nano-result';

import { translateRaw } from 'translations';
import { isPositiveIntegerOrZero } from 'libs/validators';
import { FieldInput } from './FieldInput';

interface OwnProps {
  address?: string;
  onChange(decimals: Result<string>): void;
}

export class DecimalField extends React.Component<OwnProps> {
  public render() {
    return (
      <FieldInput
        fieldName={translateRaw('TOKEN_DEC')}
        fieldToFetch={'decimals'}
        shouldEnableAutoField={req => !(req.toVal().res === '0')}
        address={this.props.address}
        userInputValidator={this.isValidUserInput}
        onChange={this.props.onChange}
      />
    );
  }

  private isValidUserInput = (userInput: string) => {
    const validDecimals = isPositiveIntegerOrZero(Number(userInput));
    const decimals: Result<string> = validDecimals
      ? Result.from({ res: userInput })
      : Result.from({ err: 'Invalid decimal' });
    return decimals;
  };
}
