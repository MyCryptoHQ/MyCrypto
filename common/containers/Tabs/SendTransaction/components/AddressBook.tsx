import React from 'react';
import { IWallet } from 'libs/wallet';
import { AddressField } from 'components';
import { Input } from 'components/ui';
import AddressBookTable from './AddressBookTable';

interface Props {
  wallet: IWallet;
}

export default class AddressBook extends React.Component<Props> {
  public render() {
    return (
      <div className="AddressBook">
        <div className="Tab-content-pane">
          <AddressBookTable />
        </div>
      </div>
    );
  }
}
