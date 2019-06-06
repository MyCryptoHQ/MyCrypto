import React, { useState } from 'react';
import { Heading, Tabs } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from 'translations';

import { FlippablePanel } from 'v2/components';
import { Layout } from 'v2/features';
import { AddressBook, AddToAddressBook, GeneralSettings } from './components';
import isMobile from 'utils/isMobile';

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

const StyledLayout = styled(props => <Layout {...props} />)`
  .Layout-content {
    padding: 0;
    @media (max-width: 850px) {
      margin-top: ${isMobile && '73px'};
    }
  }
`;

const SettingsContent = styled.div`
  padding: ${isMobile ? '0 10px' : '0 80px'};
`;

export default function Settings() {
  const [tab, setTab] = useState('wallets');

  return (
    <StyledLayout>
      {isMobile ? (
        <>
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
          <SettingsContent>
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
          </SettingsContent>
        </>
      ) : (
        <SettingsContent>
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
        </SettingsContent>
      )}
    </StyledLayout>
  );
}
