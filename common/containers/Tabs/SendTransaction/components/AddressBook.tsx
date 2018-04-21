import React from 'react';
import { AddressBookTable } from 'components';

export default class AddressBook extends React.Component {
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
