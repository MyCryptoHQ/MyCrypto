import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { TransactionFields, SendState } from '../../SendAssets';
import { ComboBox } from '@mycrypto/ui';
import { AccountContext } from 'v2/providers';
import { isValidETHAddress } from 'libs/validators';

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

type Props = OwnProps; // & StateProps;

export default class SenderAddressField extends Component<Props> {
  public isValidSender = (value: any) => {
    return isValidETHAddress(value);
  };
  public handleSenderAddress = (e: ChangeEvent<any>) => {
    const { values } = this.props;
    this.props.updateState({
      ...values,
      transactionFields: {
        ...values.transactionFields,
        senderAddress: e.target.value
      },
      rawTransactionValues: {
        ...values.rawTransactionValues,
        from: e.target.value
      }
    });

    // Conduct max nonce check
    // Conduct estimateGas
    this.props.handleChange(e);
  };

  public render() {
    return (
      <AccountContext.Consumer>
        {({ accounts }) => {
          const accountlist: string[] = [];
          accounts.map(en => {
            accountlist.push(en.address);
          });
          return (
            <Field
              name="senderAddress"
              id={'1'}
              validate={this.isValidSender}
              render={({ field }: FieldProps<TransactionFields>) => (
                <ComboBox
                  {...field}
                  id={'2'}
                  onChange={this.handleSenderAddress}
                  value={field.value}
                  items={new Set(accountlist)}
                  //placeholder={translate('VIEW_ONLY_ENTERVIEW_ONLY_ENTER')}
                  className="SendAssetsForm-fieldset-input"
                />
              )}
            />
          );
        }}
      </AccountContext.Consumer>
    );
  }
}
