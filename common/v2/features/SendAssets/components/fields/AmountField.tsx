import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { Input } from '@mycrypto/ui';
import { ITxFields, ISendState } from '../../types';
//import { donationAddressMap } from '';

interface OwnProps {
  stateValues: ISendState;
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  updateState(values: ISendState): void;
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
            <div>Amount</div> {/* TRANSLATE THIS */}
            <div className="SendAssetsForm-amountAsset-amount-label-sendMax">
              send max{/* TRANSLATE THIS */}
            </div>
          </label>
          <Field
            id={'5'}
            name="amount"
            validate={this.isValidAmount}
            render={({ field }: FieldProps<ITxFields>) => (
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
