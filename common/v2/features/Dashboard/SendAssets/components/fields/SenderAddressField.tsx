import React, { ChangeEvent, Component } from 'react';
import { Field, FieldProps } from 'formik';
import { Transaction } from '../../SendAssets';
import { ComboBox } from '@mycrypto/ui';
import { AccountContext } from 'v2/providers';

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

export default class SenderAddressField extends Component<Props> {
  public isValidateSender = (value: any) => {
    return true;
  };

  public render() {
    const { handleChange } = this.props;
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
              validate={this.isValidateSender}
              render={({ field }: FieldProps<Transaction>) => (
                <ComboBox
                  {...field}
                  id={'2'}
                  onChange={handleChange}
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
