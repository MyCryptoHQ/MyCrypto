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

export default class GasPriceField extends Component<Props> {
  public isValidGasPrice = (value: any) => {
    const valid = value >= 0 && value <= 3000;
    this.setState({ isValidGasPrice: valid });
    return valid;
  };

  render() {
    const { handleChange } = this.props;
    return (
      <Field
        name="gasPrice"
        render={({ field, form }: FieldProps<Transaction>) => (
          <Input
            {...field}
            value={field.value}
            onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
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
