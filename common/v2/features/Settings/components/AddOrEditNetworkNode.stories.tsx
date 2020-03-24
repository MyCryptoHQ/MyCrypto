import React from 'react';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';

import { DEFAULT_NETWORK } from 'v2/config';
import { NETWORKS_CONFIG, NODES_CONFIG } from 'v2/database/data';
import { CustomNodeConfig, Network, NetworkId, NodeType } from 'v2/types';
import { GAU_THEME } from 'v2/theme';
import AppProviders from 'v2/../AppProviders';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';

const networkId = DEFAULT_NETWORK;
const addNode = undefined;
const editNode: CustomNodeConfig = {
  name: 'eth_custom_node_1',
  service: 'Custom node 1',
  auth: {
    username: 'username',
    password: 'password'
  },
  url: 'https://custom.node.com/',
  isCustom: true,
  type: NodeType.MYC_CUSTOM,
  hidden: false
};
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
    />
  </div>
);

const editNetworkNode = () => (
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode
      networkId={networkId}
      editNode={editNode}
      onComplete={onComplete}
      addNodeToNetwork={addNodeToNetwork}
      isNodeNameAvailable={isNodeNameAvailable}
      getNetworkById={getNetworkById}
      updateNode={updateNode}
      deleteNode={deleteNode}
    />
  </div>
);

storiesOf('NetworkNodeForm', module)
  .addDecorator(story => <ThemeProvider theme={GAU_THEME}>{story()}</ThemeProvider>)
  .addDecorator(story => <AppProviders>{story()}</AppProviders>)
  .add('Add node', _ => addNetworkNode(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  })
  .add('Edit node', _ => editNetworkNode(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  });
