import React from 'react';
import { AddressBookTable } from 'components';

const AddressBook: React.SFC = () => (
  <div className="AddressBook">
    <div className="Tab-content-pane">
      <AddressBookTable />
    </div>
  </div>
);

export default AddressBook;
