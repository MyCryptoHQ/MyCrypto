import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { ComboBox } from '@mycrypto/ui';

import { AssetOptionsContext } from 'v2/providers';
import { ITxFields } from '../../types';

interface OwnProps {
  handleChange: Formik['handleChange'];
}

type Props = OwnProps;

export default class AssetField extends Component<Props> {
  public isValidAmount = (value: any) => {
    const valid = value >= 0;
    this.setState({ isValidAmount: valid });
    return valid;
  };

  public handleAssetField = (e: ChangeEvent<any>) => {
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
                render={({ field }: FieldProps<ITxFields>) => (
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
