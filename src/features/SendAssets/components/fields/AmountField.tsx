import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, FormikHandlers } from 'formik';
import { Input } from '@mycrypto/ui';
import { translateRaw } from '@translations';
//import { donationAddressMap } from '';

interface OwnProps {
  handleChange: FormikHandlers['handleChange'];
}

/*interface StateProps {
  name: string;
}*/

type Props = OwnProps; // & StateProps;

export default class AmountField extends Component<Props> {
  public isValidAmount = (value: any) => {
    const valid = value >= 0; // && value <= (this.balance - this.gasCost);
    this.setState({ isValidAmount: valid });
    return valid;
  };

  public handleAmountField = (e: ChangeEvent<any>) => {
    this.props.handleChange(e);
  };

  public render() {
    return (
      <div className="SendAssetsForm-fieldset SendAssetsForm-amountAsset">
        <div className="SendAssetsForm-amountAsset-amount">
          <label htmlFor="amount" className="SendAssetsForm-amountAsset-amount-label">
            <div>{translateRaw('SEND_ASSETS_AMOUNT_LABEL')}</div>
            <div className="SendAssetsForm-amountAsset-amount-label-sendMax">
              {translateRaw('SEND_ASSETS_AMOUNT_LABEL_ACTION')}
            </div>
          </label>
          <Field
            id={'5'}
            name="amount"
            validate={this.isValidAmount}
            render={({ field }: FieldProps<string>) => (
              <Input
                {...field}
                id={'6'}
                value={field.value}
                onChange={this.handleAmountField}
                placeholder="0.00"
                className="SendAssetsForm-fieldset-input"
              />
            )}
          />
        </div>
      </div>
    );
  }
}
