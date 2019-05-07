import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { TransactionFields, SendState } from '../../SendAssets';
import { Input } from '@mycrypto/ui';
//import { donationAddressMap } from '';

interface OwnProps {
  values: SendState;
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  updateState(values: SendState): void;
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
    const { values } = this.props;
    this.props.updateState({
      ...values,
      rawTransactionValues: {
        ...values.rawTransactionValues,
        gasLimit: e.target.value
      }
    });
    this.props.handleChange(e);
  };

  public render() {
    //const { handleChange } = this.props;
    return (
      <Field
        name="gasLimit"
        validate={this.isValidGasLimit}
        render={({ field }: FieldProps<TransactionFields>) => (
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
