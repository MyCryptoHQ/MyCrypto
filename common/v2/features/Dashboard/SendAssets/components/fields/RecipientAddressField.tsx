import React, { Component, ChangeEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { TransactionFields, SendState } from 'v2/features/Dashboard/SendAssets/SendAssets';
import { Input } from '@mycrypto/ui';
import { isValidETHAddress } from 'libs/validators';
import { getAssetByTicker } from 'v2/libs';
import { AssetOption } from 'v2/services/AssetOption/types';

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

type Props = OwnProps;

export default class RecipientAddressField extends Component<Props> {
  public isValidRecipientAddress = (value: any) => {
    const valid = isValidETHAddress(value);
    this.setState({ isValidFieldInput: valid });
    return valid;
  };

  public handleRecipientAddress = (e: ChangeEvent<any>) => {
    const { stateValues } = this.props;
    const assetType: AssetOption | undefined = getAssetByTicker(
      stateValues.transactionFields.asset
    );
    this.props.updateState({
      ...stateValues,
      transactionFields: {
        ...stateValues.transactionFields,
        recipientAddress: e.target.value
      },
      rawTransactionValues: {
        ...stateValues.rawTransactionValues,
        to: assetType
          ? assetType.type === 'base' ? e.target.value : assetType.contractAddress
          : 'base'
      }
    });

    // Conduct estimateGas
    this.props.handleChange(e);
  };

  public render() {
    return (
      <Field
        id={'3'}
        name="recipientAddress"
        validate={this.isValidRecipientAddress}
        render={({ field }: FieldProps<TransactionFields>) => (
          <Input
            {...field}
            value={field.value}
            onChange={this.handleRecipientAddress}
            placeholder="Enter an Address or Contact"
            className="SendAssetsForm-fieldset-input"
          />
        )}
      />
    );
  }
}
