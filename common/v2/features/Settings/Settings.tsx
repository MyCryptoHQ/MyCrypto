import React, { useState, useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS, MIN_CONTENT_PADDING, SPACING } from 'v2/theme';
import { AddressBookContext, SettingsContext, StoreContext, NetworkContext } from 'v2/services/Store';
import { AccountList, FlippablePanel, TabsNav, Desktop, Mobile } from 'v2/components';
import { NetworkId } from 'v2/types';
import { CustomNodeConfig } from 'v2/types/node';
import { DEFAULT_NETWORK, IS_ACTIVE_FEATURE } from 'v2/config';
import translate from 'v2/translations';
import { AddressBookPanel, AddToAddressBook, GeneralSettings, DangerZone } from './components';

import settingsIcon from 'common/assets/images/icn-settings.svg';
import NetworkNodes from './components/NetworkNodes';
import AddOrEditNetworkNode from './components/AddOrEditNetworkNode';

const SettingsHeading = styled(Heading)<{ forwardedAs?: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-weight: bold;
  margin-top: 0;
`;

const SettingsHeadingIcon = styled.img`
  margin-right: 24px;
  margin-top: 2px;
  width: 30px;
`;

const StyledLayout = styled.div`
  width: 960px;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  .Layout-content {
    padding: 0;
  }
`;

const SettingsTabs = styled(TabsNav)`
  /* Override the Layout margin */
  margin-left: -${MIN_CONTENT_PADDING};
  margin-right: -${MIN_CONTENT_PADDING};
  margin-bottom: ${SPACING.BASE};
`;

function renderAccountPanel() {
  const { accounts } = useContext(StoreContext);
  return (
    <AccountList
      accounts={accounts}
      deletable={true}
      copyable={true}
      privacyCheckboxEnabled={IS_ACTIVE_FEATURE.PRIVATE_TAGS}
    />
  );
}

function renderAddressPanel() {
  const {
    createAddressBooks,
    addressBook,
    addressBookRestore,
    deleteAddressBooks,
    updateAddressBooks,
    restoreDeletedAddressBook
  } = useContext(AddressBookContext);

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddToAddressBook toggleFlipped={toggleFlipped} createAddressBooks={createAddressBooks} />
        ) : (
          <AddressBookPanel
            addressBook={addressBook}
            toggleFlipped={toggleFlipped}
            updateAddressBooks={updateAddressBooks}
            deleteAddressBooks={deleteAddressBooks}
            restoreDeletedAddressBook={restoreDeletedAddressBook}
            addressBookRestore={addressBookRestore}
          />
        )
      }
    </FlippablePanel>
  );
}

function renderNetworkNodes() {
  const {
    getNetworkByName,
    addNodeToNetwork,
    isNodeNameAvailable,
    getNetworkById,
    updateNode,
    deleteNode
  } = useContext(NetworkContext);
  const { addressBook } = useContext(AddressBookContext);
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);
  const [editNode, setEditNode] = useState<CustomNodeConfig | undefined>(undefined);

  const addressBookNetworksIds = [...new Set(addressBook.map(a => a.network))];
  const addressBookNetworks = addressBookNetworksIds.map(addressId => getNetworkByName(addressId)!);

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddOrEditNetworkNode
            networkId={networkId}
            editNode={editNode}
            toggleFlipped={toggleFlipped}
            addNodeToNetwork={addNodeToNetwork}
            isNodeNameAvailable={isNodeNameAvailable}
            getNetworkById={getNetworkById}
            updateNode={updateNode}
            deleteNode={deleteNode}
          />
        ) : (
          <NetworkNodes
            networks={addressBookNetworks}
            toggleFlipped={(id, node) => {
              setNetworkId(id);
              setEditNode(node);

              toggleFlipped();
            }}
          />
        )
      }
    </FlippablePanel>
  );
}

function renderGeneralSettingsPanel() {
  const { updateSettings, settings } = useContext(SettingsContext);
  return (
    <>
      <GeneralSettings updateGlobalSettings={updateSettings} globalSettings={settings} />
      <DangerZone />
    </>
  );
}

interface TabOptions {
  [key: string]: React.ReactNode;
}

export default function Settings() {
  // In Mobile view we display a tab instead
  const [tab, setTab] = useState('accounts');
  const tabOptions: TabOptions = {
    ['accounts']: renderAccountPanel(),
    ['addresses']: renderAddressPanel(),
    ['general']: renderGeneralSettingsPanel()
  };
  const currentTab = tabOptions[tab];

  return (
    <StyledLayout>
      <Mobile>
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
      </Mobile>
      <Desktop>
        <SettingsHeading as="h2">
          <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
          {translate('SETTINGS_HEADING')}
        </SettingsHeading>
        {renderAccountPanel()}
        {renderAddressPanel()}
        {renderNetworkNodes()}
        {renderGeneralSettingsPanel()}
      </Desktop>
    </StyledLayout>
  );
}
