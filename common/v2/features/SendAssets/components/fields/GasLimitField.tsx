import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { ITxFields, ISendState } from '../../types';
import { Input } from '@mycrypto/ui';
//import { donationAddressMap } from '';

interface OwnProps {
  stateValues: ISendState;
  handleChange: Formik['handleChange'];
}

/*interface StateProps {
  name: string;
}*/

type Props = OwnProps; // & StateProps;

export default class GasLimitField extends Component<Props> {
  public isValidGasLimit = (value: any) => {
    const valid = value >= 0 && value <= 8000000;
    this.setState({ isValidGasLimit: valid });
    return valid;
  };

  public handleGasLimitField = (e: ChangeEvent<any>) => {
    this.props.handleChange(e);
  };

  public render() {
    //const { handleChange } = this.props;
    return (
      <Field
        name="gasLimitField"
        validate={this.isValidGasLimit}
        render={({ field }: FieldProps<ITxFields>) => (
          <Input
            {...field}
            value={field.value}
            onChange={this.handleGasLimitField}
            placeholder="21000"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
