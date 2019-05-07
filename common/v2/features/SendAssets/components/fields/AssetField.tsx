import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { TransactionFields } from '../../SendAssets';
import { ComboBox } from '@mycrypto/ui';
import { AssetOptionsContext } from 'v2/providers';
import { SendState } from 'v2/features/SendAssets/SendAssets';
import { getAssetByTicker } from 'v2/libs';
import { AssetOption } from 'v2/services/AssetOption/types';
//import { donationAddressMap } from '';

interface OwnProps {
  stateValues: SendState;
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

export default class AssetField extends Component<Props> {
  public isValidAmount = (value: any) => {
    const valid = value >= 0; // && value <= (this.balance - this.gasCost);
    this.setState({ isValidAmount: valid });
    return valid;
  };

  public handleAssetField = (e: ChangeEvent<any>) => {
    const { stateValues } = this.props;
    const assetType: AssetOption | undefined = getAssetByTicker(e.target.value);
    this.props.updateState({
      ...stateValues,
      rawTransactionValues: {
        from: '',
        to: '',
        value: '',
        data: '',
        gasLimit: '',
        gasPrice: '',
        nonce: ''
      },
      assetType: assetType ? assetType.type : 'base',
      network: assetType ? assetType.network : 'ETH'
    });
    // Conduct estimateGas
    // Conduct clearFields
    this.props.handleChange(e);
  };

  public render() {
    return (
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
                render={({ field }: FieldProps<TransactionFields>) => (
                  <ComboBox
                    {...field}
                    id={'8'}
                    onChange={this.handleAssetField}
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
    );
  }
}
