import React from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { FlippablePanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AddAccount, AddressBook, AddToAddressBook, GeneralSettings } from './components';

// Legacy
import settingsIcon from 'common/assets/images/icn-settings.svg';
import { AccountList } from '../components';
import { AccountContext, AddressMetadataContext } from 'v2/providers';

const SettingsHeading = styled(Heading)`
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  color: #163150;
`;

const SettingsHeadingIcon = styled.img`
  margin-right: 12px;
`;

export default function Settings() {
  return (
    <Layout className="Settings">
      <SettingsHeading>
        <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
        Settings
      </SettingsHeading>
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
          <FlippablePanel>
            {({ flipped }) =>
              flipped ? (
                <AddAccount />
              ) : (
                <AccountList accounts={accounts} deleteAccount={deleteAccount} />
              )
            }
          </FlippablePanel>
        )}
      </AccountContext.Consumer>
      <AddressMetadataContext.Consumer>
        {({ createAddressMetadatas, addressMetadata, deleteAddressMetadatas }) => (
          <FlippablePanel>
            {({ flipped, toggleFlipped }) =>
              flipped ? (
                <AddToAddressBook
                  toggleFlipped={toggleFlipped}
                  createAddressMetadatas={createAddressMetadatas}
                />
              ) : (
                <AddressBook
                  addressMetadata={addressMetadata}
                  toggleFlipped={toggleFlipped}
                  deleteAddressMetadatas={deleteAddressMetadatas}
                />
              )
            }
          </FlippablePanel>
        )}
      </AddressMetadataContext.Consumer>
      <GeneralSettings />
    </Layout>
  );
}
