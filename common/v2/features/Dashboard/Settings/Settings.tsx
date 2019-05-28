import React, { useState } from 'react';
import { Heading, Tabs } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from 'translations';

import { FlippablePanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AddressBook, AddToAddressBook, GeneralSettings } from './components';

// Legacy
import settingsIcon from 'common/assets/images/icn-settings.svg';
import { AccountList } from '../components';
import { AccountContext, AddressMetadataContext, GlobalSettingsContext } from 'v2/providers';

const SettingsHeading = styled(Heading)`
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  color: #163150;
`;

const SettingsHeadingIcon = styled.img`
  margin-right: 12px;
`;

const DesktopSettings = styled.div`
  display: block;
  @media (max-width: 700px) {
    display: none;
  }
`;

const MobileSettings = styled.div`
  display: none;
  @media (max-width: 700px) {
    display: block;
  }
`;

export default function Settings() {
  const [tab, setTab] = useState('wallets');
  console.log(tab);

  return (
    <Layout className="Settings">
      <MobileSettings>
        <Tabs>
          <a href="#" onClick={() => setTab('wallets')}>
            Your Wallets
          </a>
          <a href="#" onClick={() => setTab('addresses')}>
            Addresses
          </a>
          <a href="#" onClick={() => setTab('general')}>
            General
          </a>
        </Tabs>
        <SettingsHeading>
          <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
          {translate('SETTINGS_HEADING')}
        </SettingsHeading>
        {tab === 'wallets' && (
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
        )}

        {tab === 'addresses' && (
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
        )}
        {tab === 'general' && (
          <GlobalSettingsContext.Consumer>
            {({ updateGlobalSettings, globalSettings }) => (
              <GeneralSettings
                updateGlobalSettings={updateGlobalSettings}
                globalSettings={globalSettings}
              />
            )}
          </GlobalSettingsContext.Consumer>
        )}
      </MobileSettings>
      <DesktopSettings>
        <SettingsHeading>
          <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
          {translate('SETTINGS_HEADING')}
        </SettingsHeading>
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
        <GlobalSettingsContext.Consumer>
          {({ updateGlobalSettings, globalSettings }) => (
            <GeneralSettings
              updateGlobalSettings={updateGlobalSettings}
              globalSettings={globalSettings}
            />
          )}
        </GlobalSettingsContext.Consumer>
      </DesktopSettings>
    </Layout>
  );
}
