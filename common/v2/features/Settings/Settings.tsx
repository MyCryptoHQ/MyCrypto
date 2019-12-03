import React, { useState, useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from 'v2/translations';

import { IS_MOBILE } from 'v2/utils';
import { BREAK_POINTS, MIN_CONTENT_PADDING } from 'v2/theme';
import { AddressBookContext, SettingsContext } from 'v2/services/Store';
import { AccountList, FlippablePanel, TabsNav } from 'v2/components';
import { AddressBookPanel, AddToAddressBook, GeneralSettings } from './components';

import settingsIcon from 'common/assets/images/icn-settings.svg';

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
  width: 960px;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  .Layout-content {
    padding: 0;
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    .Layout-content {
      margin-top: ${IS_MOBILE && '73px'};
    }
  }
`;

const SettingsTabs = styled(TabsNav)`
  margin-top: -44px;
  margin-left: -${MIN_CONTENT_PADDING};
  margin-right: -${MIN_CONTENT_PADDING};
`;

function renderAccountPanel() {
  return (
    <FlippablePanel>
      {({ flipped }) =>
        flipped ? <p>Add Account</p> : <AccountList deletable={true} copyable={true} />
      }
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
  const [tab, setTab] = useState('accounts');
  const tabOptions: TabOptions = {
    ['accounts']: renderAccountPanel(),
    ['addresses']: renderAddressPanel(),
    ['general']: renderGeneralSettingsPanel()
  };
  const currentTab = tabOptions[tab];
  return (
    <>
      <SettingsTabs>
        <a href="#" onClick={() => setTab('accounts')}>
          Accounts
        </a>
        <a href="#" onClick={() => setTab('addresses')}>
          Addresses
        </a>
        <a href="#" onClick={() => setTab('general')}>
          General
        </a>
      </SettingsTabs>
      <>{currentTab}</>
    </>
  );
}

function renderDesktop() {
  return (
    <>
      <SettingsHeading>
        <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
        {translate('SETTINGS_HEADING')}
      </SettingsHeading>
      {renderAccountPanel()}
      {renderAddressPanel()}
      {renderGeneralSettingsPanel()}
    </>
  );
}

// @TODO: Use { Desktop, Mobile } components instead
export default function Settings() {
  return <StyledLayout>{IS_MOBILE ? renderMobile() : renderDesktop()}</StyledLayout>;
}
