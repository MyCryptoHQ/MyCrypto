import React, { Component, ChangeEvent } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { ITxFields } from 'v2/features/SendAssets/types';
import { Input } from '@mycrypto/ui';
import { isValidETHAddress } from 'libs/validators';

interface OwnProps {
  handleChange: Formik['handleChange'];
}

type Props = OwnProps;

export default class RecipientAddressField extends Component<Props> {
  public isValidRecipientAddress = (value: any) => {
    const valid = isValidETHAddress(value);
    this.setState({ isValidFieldInput: valid });
    return valid;
  };

  public handleRecipientAddress = (e: ChangeEvent<any>) => {
    // Conduct estimateGas
    this.props.handleChange(e);
  };

  public render() {
    return (
      <Field
        id={'3'}
        name="recipientAddress"
        validate={this.isValidRecipientAddress}
        render={({ field }: FieldProps<ITxFields>) => (
          <Input
            {...field}
            value={field.value}
            onChange={this.handleRecipientAddress}
            placeholder="Enter an Address or Contact"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
