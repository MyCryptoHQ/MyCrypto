import React, { useContext, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import settingsIcon from '@assets/images/icn-settings.svg';
import { AccountList, Desktop, Mobile } from '@components';
import MobileNavBar from '@components/MobileNavBar';
import { DEFAULT_NETWORK } from '@config';
import { getFiat } from '@config/fiats';
import FlippablePanel from '@features/Settings/components/FlippablePanel';
import { useFeatureFlags, useRates } from '@services';
import {
  NetworkUtils,
  StoreContext,
  useAssets,
  useContacts,
  useNetworks,
  useSettings
} from '@services/Store';
import { isExcludedAsset } from '@services/Store/helpers';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';
import { Balance, CustomNodeConfig, NetworkId } from '@types';
import { buildBalances, buildTotalFiatValue } from '@utils';

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

function RendedExcludedAssetsPanel() {
  const { accounts, totals, currentAccounts } = useContext(StoreContext);
  const { settings } = useSettings();
  const { getAssetRate } = useRates();
  const balances: Balance[] = buildBalances(
    totals,
    currentAccounts,
    settings,
    getAssetRate,
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
  const { featureFlags } = useFeatureFlags();
  const { accounts } = useContext(StoreContext);
  return (
    <AccountList
      accounts={accounts}
      deletable={true}
      copyable={true}
      privacyCheckboxEnabled={featureFlags.PRIVATE_TAGS}
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
  const {
    addNetwork,
    networks: allNetworks,
    addNodeToNetwork,
    isNodeNameAvailable,
    getNetworkById,
    updateNode,
    deleteNode
  } = useNetworks();
  const { createAsset } = useAssets();
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
              addNodeToNetwork={addNodeToNetwork}
              isNodeNameAvailable={isNodeNameAvailable}
              getNetworkById={getNetworkById}
              updateNode={updateNode}
              deleteNode={deleteNode}
              addNetwork={addNetwork}
              addAsset={createAsset}
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
              toggleFlipped();
            }}
          />
        )
      }
    </FlippablePanel>
  );
}

function RenderGeneralSettingsPanel() {
  const { updateSettings, settings } = useSettings();
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
          <SettingsHeadingIcon src={settingsIcon} alt="Settings" />
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
