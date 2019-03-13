import React from 'react';
import { Heading } from '@mycrypto/ui';

import { FlippablePanel } from 'v2/components';
import { Layout } from 'v2/features';
import {
  AddAccount,
  AddressBook,
  YourAccounts,
  AddToAddressBook,
  GeneralSettings
} from './components';
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
      <FlippablePanel>
        {({ flipped, toggleFlipped }) =>
          flipped ? <AddAccount /> : <YourAccounts toggleFlipped={toggleFlipped} />
        }
      </FlippablePanel>
      <FlippablePanel>
        {({ flipped, toggleFlipped }) =>
          flipped ? (
            <AddToAddressBook toggleFlipped={toggleFlipped} />
          ) : (
            <AddressBook toggleFlipped={toggleFlipped} />
          )
        }
      </FlippablePanel>
      <GeneralSettings />
    </Layout>
  );
}
