import React from 'react';
import { Input } from 'components/ui';
import { translateRaw } from 'translations';
import { IGenerateAddressLookup } from './AddCustomTokenForm';
import { isValidETHAddress } from 'libs/validators';

interface OwnProps {
  addressLookup: IGenerateAddressLookup;
  onChange(address: string, isValid: boolean): void;
}

enum ErrType {
  INVALIDADDR = 'Not a valid address',
  ADDRTAKEN = 'A token with this address already exists'
}

interface State {
  address: string;

  err?: ErrType;
}

export class AddressField extends React.Component<OwnProps, State> {
  public state: State = {
    address: ''
  };

  public render() {
    const { err, address } = this.state;

    return (
      <label className="AddCustom-field form-group">
        <div className="input-group-header">{translateRaw('TOKEN_DEC')}</div>
        <Input
          isValid={!err}
          className="input-group-input-small"
          type="text"
          name="Address"
          value={address}
          onChange={this.handleFieldChange}
        />
        {err && <div className="AddCustom-field-error">{err}</div>}
      </label>
    );
  }

  private handleFieldChange(args: React.FormEvent<HTMLInputElement>) {
    const address = args.currentTarget.value;
    const addrTaken = this.props.addressLookup[address];
    const invalidAddr = isValidETHAddress(address);
    let err = addrTaken ? ErrType.ADDRTAKEN : invalidAddr ? ErrType.INVALIDADDR : undefined;
    this.setState({ address, err });
    this.props.onChange(address, !err);
  }
}
