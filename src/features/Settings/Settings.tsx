import { ReactNode, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountList, Desktop, Icon, Mobile } from '@components';
import MobileNavBar from '@components/MobileNavBar';
import { DEFAULT_NETWORK } from '@config';
import { getFiat } from '@config/fiats';
import FlippablePanel from '@features/Settings/components/FlippablePanel';
import { buildBalances, buildTotalFiatValue } from '@helpers';
import { useFeatureFlags, useRates } from '@services';
import { NetworkUtils, useContacts, useNetworks, useSettings } from '@services/Store';
import { isExcludedAsset } from '@services/Store/helpers';
import { getStoreAccounts, selectCurrentAccounts, useSelector } from '@store';
import { BREAK_POINTS, COLORS } from '@theme';
import translate from '@translations';
import { Balance, CustomNodeConfig, NetworkId } from '@types';

import AddOrEditNetworkNode from './components/AddOrEditNetworkNode';
import AddressBookPanel from './components/AddressBook';
import AddToAddressBook from './components/AddToAddressBook';
import DangerZone from './components/DangerZone';
import ExcludedAssetsPanel from './components/ExcludedAssets';
import GeneralSettings from './components/GeneralSettings';
import NetworkNodes from './components/NetworkNodes';

const SettingsHeading = styled(Heading)<{ forwardedAs?: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-weight: bold;
  margin-top: 0;
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

function RendedExcludedAssetsPanel() {
  const accounts = useSelector(getStoreAccounts);
  const { settings } = useSettings();
  const { getAssetRate, getAssetChange } = useRates();
  const currentAccounts = useSelector(selectCurrentAccounts);
  const balances: Balance[] = buildBalances(
    currentAccounts,
    settings,
    getAssetRate,
    getAssetChange,
    isExcludedAsset
  );

  const totalFiatValue = buildTotalFiatValue(balances);

  const fiat = getFiat(settings);

  return (
    <ExcludedAssetsPanel
      balances={balances}
      totalFiatValue={totalFiatValue}
      fiat={fiat}
      accounts={accounts}
      selected={settings.dashboardAccounts}
    />
  );
}

function RenderAccountPanel() {
  const { isFeatureActive } = useFeatureFlags();
  const accounts = useSelector(getStoreAccounts);
  return (
    <AccountList
      accounts={accounts}
      deletable={true}
      copyable={true}
      privacyCheckboxEnabled={isFeatureActive('PRIVATE_TAGS')}
    />
  );
}

function RenderAddressPanel() {
  const {
    createContact,
    contacts,
    contactRestore,
    deleteContact,
    updateContact,
    restoreDeletedContact
  } = useContacts();

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddToAddressBook toggleFlipped={toggleFlipped} createContact={createContact} />
        ) : (
          <AddressBookPanel
            contacts={contacts}
            toggleFlipped={toggleFlipped}
            updateContact={updateContact}
            deleteContact={deleteContact}
            restoreDeletedContact={restoreDeletedContact}
            contactRestore={contactRestore}
          />
        )
      }
    </FlippablePanel>
  );
}

function RenderNetworkNodes() {
  const { networks: allNetworks, getNetworkById } = useNetworks();
  const { contacts } = useContacts();
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);
  const [editNode, setEditNode] = useState<CustomNodeConfig | undefined>(undefined);
  const [isAddingNetwork, setAddingNetwork] = useState(false);

  const contactNetworks = NetworkUtils.getDistinctNetworks(contacts, getNetworkById);
  const networks = allNetworks.filter(
    (n) => n.isCustom || contactNetworks.some((a) => a.id === n.id)
  );

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <>
            <AddOrEditNetworkNode
              networkId={networkId}
              editNode={editNode}
              onComplete={toggleFlipped}
              isAddingCustomNetwork={isAddingNetwork}
            />
          </>
        ) : (
          <NetworkNodes
            networks={networks}
            toggleFlipped={(id, node) => {
              setNetworkId(id);
              setEditNode(node);
              setAddingNetwork(false);

              toggleFlipped();
            }}
            toggleNetworkCreation={() => {
              setAddingNetwork(true);
              setEditNode(undefined);
              toggleFlipped();
            }}
          />
        )
      }
    </FlippablePanel>
  );
}

function RenderGeneralSettingsPanel() {
  return (
    <>
      <GeneralSettings />
      <DangerZone />
    </>
  );
}

interface TabOptions {
  [key: string]: ReactNode;
}

export default function Settings() {
  // In Mobile view we display a tab instead
  const [tab, setTab] = useState('accounts');
  const tabOptions: TabOptions = {
    ['accounts']: RenderAccountPanel(),
    ['addresses']: RenderAddressPanel(),
    ['general']: RenderGeneralSettingsPanel(),
    ['nodes']: RenderNetworkNodes()
  };
  const currentTab = tabOptions[tab];

  return (
    <StyledLayout>
      <Mobile>
        <MobileNavBar>
          <div
            className={`tab ${tab === 'accounts' ? 'active' : ''}`}
            onClick={() => setTab('accounts')}
          >
            <h6>Accounts</h6>
          </div>
          <div
            className={`tab ${tab === 'addresses' ? 'active' : ''}`}
            onClick={() => setTab('addresses')}
          >
            <h6>Addresses</h6>
          </div>
          <div className="w-100" />
          <div className={`tab ${tab === 'nodes' ? 'active' : ''}`} onClick={() => setTab('nodes')}>
            <h6>Network & Nodes</h6>
          </div>
          <div
            className={`tab ${tab === 'general' ? 'active' : ''}`}
            onClick={() => setTab('general')}
          >
            <h6>General</h6>
          </div>
        </MobileNavBar>
        <>{currentTab}</>
      </Mobile>
      <Desktop>
        <SettingsHeading as="h2">
          <Icon
            style={{ marginRight: '24px', marginTop: '2px' }}
            type="nav-settings"
            width="30px"
            color={COLORS.BLUE_BRIGHT}
            alt="Settings"
          />
          {translate('SETTINGS_HEADING')}
        </SettingsHeading>
        {RenderAccountPanel()}
        {RenderAddressPanel()}
        {RendedExcludedAssetsPanel()}
        {RenderNetworkNodes()}
        {RenderGeneralSettingsPanel()}
      </Desktop>
    </StyledLayout>
  );
}
