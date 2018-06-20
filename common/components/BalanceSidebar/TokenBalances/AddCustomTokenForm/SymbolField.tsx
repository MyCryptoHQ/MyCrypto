import React from 'react';
import { Result } from 'mycrypto-nano-result';

import { translateRaw } from 'translations';
import { IGenerateSymbolLookup } from './AddCustomTokenForm';
import { FieldInput } from './FieldInput';

interface OwnProps {
  address?: string;
  symbolLookup: IGenerateSymbolLookup;
  onChange(symbol: Result<string>): void;
}

export class SymbolField extends React.Component<OwnProps> {
  public render() {
    return (
      <FieldInput
        fieldName={translateRaw('TOKEN_SYMBOL')}
        fieldToFetch={'symbol'}
        shouldEnableAutoField={req => !req.err()}
        address={this.props.address}
        userInputValidator={this.isValidUserInput}
        fetchedFieldValidator={field =>
          field
            ? Result.from({ res: field })
            : Result.from({ err: 'No Symbol found, please input the token symbol manually' })
        }
        onChange={this.props.onChange}
      />
    );
  }

  private isValidUserInput = (userInput: string) => {
    const validSymbol = !this.props.symbolLookup[userInput];
    const symbol: Result<string> = validSymbol
      ? Result.from({ res: userInput })
      : Result.from({ err: 'A token with this symbol already exists' });
    return symbol;
  };
}
