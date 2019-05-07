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

export default class GasPriceField extends Component<Props> {
  public isValidGasPrice = (value: any) => {
    const valid = value >= 0 && value <= 3000;
    this.setState({ isValidGasPrice: valid });
    return valid;
  };

  public handleGasPriceField = (e: ChangeEvent<any>) => {
    const { values } = this.props;
    this.props.updateState({
      ...values,
      rawTransactionValues: {
        ...values.rawTransactionValues,
        gasPrice: e.target.value
      }
    });
    this.props.handleChange(e);
  };

  public render() {
    return (
      <Field
        name="gasPrice"
        render={({ field }: FieldProps<TransactionFields>) => (
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
