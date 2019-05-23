import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { ITxFields } from '../../types';
import { ComboBox } from '@mycrypto/ui';
import { AccountContext } from 'v2/providers';
import { isValidETHAddress } from 'libs/validators';

interface OwnProps {
  handleChange: Formik['handleChange'];
}

type Props = OwnProps; // & StateProps;

export default class SenderAddressField extends Component<Props> {
  public isValidSender = (value: any) => {
    return isValidETHAddress(value);
  };
  public handleSenderAddress = (e: ChangeEvent<any>) => {
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
              render={({ field }: FieldProps<ITxFields>) => (
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
