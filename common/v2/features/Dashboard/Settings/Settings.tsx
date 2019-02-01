import React from 'react';
import { Heading } from '@mycrypto/ui';

import { Layout } from 'v2/features';
import { AddressBook, YourAccounts } from './components';
import './Settings.scss';

// Legacy
import settingsIcon from 'common/assets/images/icn-settings.svg';

export default function Settings() {
  return (
    <Layout className="Settings">
      <Heading className="Settings-heading">
        <img src={settingsIcon} alt="Settings" className="Settings-heading-icon" />
        Settings
      </Heading>
      <YourAccounts />
      <AddressBook />
    </Layout>
  );
}
