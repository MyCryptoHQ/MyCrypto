import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';

import { DEFAULT_NETWORK } from '@config';
import { NETWORKS_CONFIG, NODES_CONFIG } from '@database/data';
import { Network, NetworkId } from '@types';
import { theme } from '@theme';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';
import AppProviders from 'AppProviders';
import { customNodeConfig } from '@fixtures';

const networkId = DEFAULT_NETWORK;
const addNode = undefined;
const onComplete = () => undefined;
const addNodeToNetwork = () => undefined;
const isNodeNameAvailable = () => true;
const getNetworkById = (id: NetworkId) =>
  (({
    ...NETWORKS_CONFIG[id],
    nodes: NODES_CONFIG[id]
  } as unknown) as Network);
const updateNode = () => undefined;
const deleteNode = () => undefined;
const addNetwork = () => undefined;
const addAsset = () => undefined;

const addNetworkNode = () => (
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode
      networkId={networkId}
      editNode={addNode}
      onComplete={onComplete}
      addNodeToNetwork={addNodeToNetwork}
      isNodeNameAvailable={isNodeNameAvailable}
      getNetworkById={getNetworkById}
      updateNode={updateNode}
      deleteNode={deleteNode}
      addNetwork={addNetwork}
      addAsset={addAsset}
      isAddingCustomNetwork={false}
    />
  </div>
);

const editNetworkNode = () => (
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode
      networkId={networkId}
      editNode={customNodeConfig}
      onComplete={onComplete}
      addNodeToNetwork={addNodeToNetwork}
      isNodeNameAvailable={isNodeNameAvailable}
      getNetworkById={getNetworkById}
      updateNode={updateNode}
      deleteNode={deleteNode}
      addNetwork={addNetwork}
      addAsset={addAsset}
      isAddingCustomNetwork={false}
    />
  </div>
);

storiesOf('NetworkNodeForm', module)
  .addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>)
  .addDecorator((story) => <AppProviders>{story()}</AppProviders>)
  .add('Add node', () => addNetworkNode(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  })
  .add('Edit node', () => editNetworkNode(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  });
