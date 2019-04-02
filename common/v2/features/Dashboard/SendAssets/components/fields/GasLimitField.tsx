import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { Transaction } from '../../SendAssets';
import { Input } from '@mycrypto/ui';
//import { donationAddressMap } from '';

interface OwnProps {
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
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

  public render() {
    //const { handleChange } = this.props;
    return (
      <Field
        name="gasLimit"
        validate={this.isValidGasLimit}
        render={({ field, form }: FieldProps<Transaction>) => (
          <Input
            {...field}
            value={field.value}
            onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
            placeholder="21000"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
