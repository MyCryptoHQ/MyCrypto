import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { Input } from '@mycrypto/ui';
import { ITxFields, ISendState } from '../../types';
//import { donationAddressMap } from '';

interface OwnProps {
  values: ISendState;
  handleChange: Formik['handleChange'];
}

type Props = OwnProps; // & StateProps;

export default class DataField extends Component<Props> {
  public isValidDataInput = () => {
    const valid = true;
    this.setState({ isValidDataInput: valid });
    return valid;
  };

  public handleDataField = (e: ChangeEvent<any>) => {
    // Conduct estimateGas
    // Conduct clearFields
    this.props.handleChange(e);
  };

  public render() {
    //const { handleChange } = this.props;
    return (
      <Field
        name="data"
        validate={this.isValidDataInput}
        render={({ field }: FieldProps<ITxFields>) => (
          <Input
            {...field}
            maxLength={10}
            value={field.value}
            onChange={this.handleDataField}
            placeholder="0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
