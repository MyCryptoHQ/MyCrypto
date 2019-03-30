import React, { Component } from 'react';
import { Field, FieldProps } from 'formik';
import { Transaction } from '../../SendAssets';
import { Input } from '@mycrypto/ui';
import { isValidETHAddress } from 'libs/validators';

interface StateProps {
  isValidFieldInput: boolean;
}

export default class RecipientAddressField extends Component {
  public state: StateProps = {
    isValidFieldInput: true
  };
  public isValidRecipientAddress = (value: any) => {
    const valid = isValidETHAddress(value);
    this.setState({ isValidFieldInput: valid });
    return valid;
  };

  public render() {
    return (
      <Field
        id={'3'}
        name="recipientAddress"
        validate={this.isValidRecipientAddress}
        render={({ field }: FieldProps<Transaction>) => (
          <Input
            {...field}
            value={field.value}
            placeholder="Enter an Address or Contact"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
