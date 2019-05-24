import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { ITxFields, ISendState } from '../../types';
import { Input } from '@mycrypto/ui';
//import { donationAddressMap } from '';

interface OwnProps {
  stateValues: ISendState;
  handleChange: Formik['handleChange'];
}

type Props = OwnProps;

export default class GasPriceField extends Component<Props> {
  public isValidGasPrice = (value: any) => {
    const valid = value >= 0 && value <= 3000;
    this.setState({ isValidGasPrice: valid });
    return valid;
  };

  public handleGasPriceField = (e: ChangeEvent<any>) => {
    this.props.handleChange(e);
  };

  public render() {
    return (
      <Field
        name="gasPriceField"
        render={({ field }: FieldProps<ITxFields>) => (
          <Input
            {...field}
            value={field.value}
            onChange={this.handleGasPriceField}
            placeholder="20"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
/*
export default connect((state: AppState): StateProps => ({
  name: 'meh'
}))(RecipientAddressField);*/
//export default connect((state: AppState) => ((RecipientAddressField)));
