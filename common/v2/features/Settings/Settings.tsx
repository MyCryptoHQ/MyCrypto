import React, { useState, useContext } from 'react';
import { Heading, Tabs } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from 'translations';

import { AccountList, FlippablePanel } from 'v2/components';
import { AddressBookPanel, AddToAddressBook, GeneralSettings } from './components';
import IS_MOBILE from 'utils/isMobile';

import settingsIcon from 'common/assets/images/icn-settings.svg';
import { AddressBookContext, SettingsContext } from 'v2/services/Store';

const SettingsHeading = styled(Heading)`
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  color: #163150;
`;

const SettingsHeadingIcon = styled.img`
  margin-right: 12px;
`;

const StyledLayout = styled.div`
  .Layout-content {
    padding: 0;
    @media (max-width: 850px) {
      margin-top: ${IS_MOBILE && '73px'};
    }
  }
`;

const SettingsContent = styled.div`
  padding: ${IS_MOBILE ? '0 10px' : '0 80px'};
`;

function renderAccountPanel() {
  return (
    <FlippablePanel>
      {({ flipped }) => (flipped ? <p>Add Account</p> : <AccountList deletable={true} />)}
    </FlippablePanel>
  );
}

function renderAddressPanel() {
  const { createAddressBooks, addressBook, deleteAddressBooks } = useContext(AddressBookContext);
  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddToAddressBook toggleFlipped={toggleFlipped} createAddressBooks={createAddressBooks} />
        ) : (
          <AddressBookPanel
            addressBook={addressBook}
            toggleFlipped={toggleFlipped}
            deleteAddressBooks={deleteAddressBooks}
          />
        )
      }
    </FlippablePanel>
  );
}

function renderGeneralSettingsPanel() {
  const { updateSettings, settings } = useContext(SettingsContext);
  return <GeneralSettings updateGlobalSettings={updateSettings} globalSettings={settings} />;
}

interface TabOptions {
  [key: string]: React.ReactNode;
}

function renderMobile() {
  const [tab, setTab] = useState('wallets');
  const tabOptions: TabOptions = {
    ['wallets']: renderAccountPanel(),
    ['addresses']: renderAddressPanel(),
    ['general']: renderGeneralSettingsPanel()
  };
  const currentTab = tabOptions[tab];
  return (
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
        {currentTab}
      </SettingsContent>
    </>
  );
}

function renderDesktop() {
  return (
    <SettingsContent>
      <SettingsHeading>
        <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
        {translate('SETTINGS_HEADING')}
      </SettingsHeading>
      {renderAccountPanel()}
      {renderAddressPanel()}
      {renderGeneralSettingsPanel()}
    </SettingsContent>
  );
}

// @TODO: Use { Desktop, Mobile } components instead
export default function Settings() {
  return <StyledLayout>{IS_MOBILE ? renderMobile() : renderDesktop()}</StyledLayout>;
}
