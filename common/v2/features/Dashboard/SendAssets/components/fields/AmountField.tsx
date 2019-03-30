import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { Transaction } from '../../SendAssets';
import { Input, ComboBox } from '@mycrypto/ui';
import { AssetOptionsContext } from 'v2/providers';
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

export default class AmountField extends Component<Props> {
  public isValidateAmount = (value: any) => {
    const valid = value >= 0; // && value <= (this.balance - this.gasCost);
    this.setState({ isValidAmount: valid });
    return valid;
  };

  render() {
    const { handleChange } = this.props;
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
            validate={this.isValidateAmount}
            render={({ field, form }: FieldProps<Transaction>) => (
              <Input
                {...field}
                id={'6'}
                value={field.value}
                onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                placeholder="0.00"
                className="SendAssetsForm-fieldset-input"
              />
            )}
          />
        </div>
        <div className="SendAssetsForm-amountAsset-asset">
          <label htmlFor="asset">Asset</label>
          <AssetOptionsContext.Consumer>
            {({ assetOptions = [] }) => {
              const assetslist: string[] = [];
              assetOptions.map(en => {
                assetslist.push(en.ticker);
              });
              return (
                <Field
                  id={'7'}
                  name="asset"
                  render={({ field }: FieldProps<Transaction>) => (
                    <ComboBox
                      {...field}
                      id={'8'}
                      onChange={handleChange}
                      value={field.value}
                      items={new Set(assetslist)}
                      className="SendAssetsForm-fieldset-input"
                    />
                  )}
                />
              );
            }}
          </AssetOptionsContext.Consumer>
        </div>
      </div>
    );
  }
}
