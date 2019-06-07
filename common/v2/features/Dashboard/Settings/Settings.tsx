import React from 'react';
import { Heading } from '@mycrypto/ui';

import { FlippablePanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AddressBook, AddToAddressBook, GeneralSettings } from './components';
import './Settings.scss';

// Legacy
import settingsIcon from 'common/assets/images/icn-settings.svg';
import { AccountList } from '../components';
import { AccountContext, AddressBookContext } from 'v2/providers';

export default function Settings() {
  return (
    <Layout className="Settings">
      <Heading className="Settings-heading">
        <img src={settingsIcon} alt="Settings" className="Settings-heading-icon" />
        Settings
      </Heading>
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
          <FlippablePanel>
            {({ flipped }) =>
              flipped ? (
                <p>Add Account</p>
              ) : (
                <AccountList accounts={accounts} deleteAccount={deleteAccount} />
              )
            }
          </FlippablePanel>
        )}
      </AccountContext.Consumer>
      <AddressBookContext.Consumer>
        {({ createAddressBooks, addressBook, deleteAddressBooks }) => (
          <FlippablePanel>
            {({ flipped, toggleFlipped }) =>
              flipped ? (
                <AddToAddressBook
                  toggleFlipped={toggleFlipped}
                  createAddressBooks={createAddressBooks}
                />
              ) : (
                <AddressBook
                  addressBook={addressBook}
                  toggleFlipped={toggleFlipped}
                  deleteAddressBooks={deleteAddressBooks}
                />
              )
            }
          </FlippablePanel>
        )}
      </AddressBookContext.Consumer>
      <GeneralSettings />
    </Layout>
  );
}
