import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import {
  AddressBookContext,
  NetworkContext,
  NetworkUtils,
  SettingsContext,
  StoreContext
} from '@services/Store';
import { buildBalances, buildTotalFiatValue } from '@utils';
import { AccountList, Mobile, Desktop } from '@components';
import { NetworkId, CustomNodeConfig, Balance } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';
import FlippablePanel from '@features/Settings/components/FlippablePanel';
import { RatesContext } from '@services/RatesProvider';
import { getFiat } from '@config/fiats';
import { isExcludedAsset } from '@services/Store/helpers';
import { useFeatureFlags } from '@services';

import settingsIcon from '@assets/images/icn-settings.svg';
import AddToAddressBook from './components/AddToAddressBook';
import AddOrEditNetworkNode from './components/AddOrEditNetworkNode';
import NetworkNodes from './components/NetworkNodes';
import MobileNavBar from '@components/MobileNavBar';
import AddressBookPanel from './components/AddressBook';
import ExcludedAssetsPanel from './components/ExcludedAssets';
import GeneralSettings from './components/GeneralSettings';
import DangerZone from './components/DangerZone';

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

function rendedExcludedAssetsPanel() {
  const { accounts, totals, currentAccounts } = useContext(StoreContext);
  const { settings } = useContext(SettingsContext);
  const { getAssetRate } = useContext(RatesContext);
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

function renderAccountPanel() {
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();
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
    addNodeToNetwork,
    isNodeNameAvailable,
    getNetworkById,
    updateNode,
    deleteNode
  } = useContext(NetworkContext);
  const { addressBook } = useContext(AddressBookContext);
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);
  const [editNode, setEditNode] = useState<CustomNodeConfig | undefined>(undefined);

  const addressBookNetworks = NetworkUtils.getDistinctNetworks(addressBook, getNetworkById);

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddOrEditNetworkNode
            networkId={networkId}
            editNode={editNode}
            onComplete={toggleFlipped}
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
    ['general']: renderGeneralSettingsPanel(),
    ['nodes']: renderNetworkNodes()
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
        {renderAccountPanel()}
        {renderAddressPanel()}
        {rendedExcludedAssetsPanel()}
        {renderNetworkNodes()}
        {renderGeneralSettingsPanel()}
      </Desktop>
    </StyledLayout>
  );
}
