import React from 'react';
import { Result } from 'mycrypto-nano-result';

import { translateRaw } from 'translations';
import { isValidETHAddress } from 'libs/validators';
import { Input } from 'components/ui';
import { IGenerateAddressLookup } from './AddCustomTokenForm';

interface OwnProps {
  addressLookup: IGenerateAddressLookup;
  onChange(address: Result<string>): void;
}

enum ErrType {
  INVALIDADDR = 'Not a valid address',
  ADDRTAKEN = 'A token with this address already exists'
}

interface State {
  address: Result<string>;
  userInput: string;
}

export class AddressField extends React.Component<OwnProps, State> {
  public state: State = {
    address: Result.from({ res: '' }),
    userInput: ''
  };

  public render() {
    const { userInput, address } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{translateRaw('TOKEN_ADDR')}</div>
        <Input
          isValid={address.ok()}
          className="input-group-input-small"
          type="text"
          name="Address"
          value={address.ok() ? address.unwrap() : userInput}
          onChange={this.handleFieldChange}
        />
        {address.err() && <div className="AddCustom-field-error">{address.err()}</div>}
      </label>
    );
  }

  private handleFieldChange = (e: React.FormEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    const addrTaken = this.props.addressLookup[userInput];
    const validAddr = isValidETHAddress(userInput);
    const err = addrTaken ? ErrType.ADDRTAKEN : !validAddr ? ErrType.INVALIDADDR : undefined;
    const address: Result<string> = err ? Result.from({ err }) : Result.from({ res: userInput });

    this.setState({ userInput, address });
    this.props.onChange(address);
  };
}
