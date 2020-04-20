import React from 'react';
import { storiesOf } from '@storybook/react';

import { Network as INetwork, NetworkId } from 'v2/types';
import { NETWORKS_CONFIG, NODES_CONFIG } from 'v2/database/data';
import AppProviders from 'v2/../AppProviders';

import NetworkNodes from './NetworkNodes';

const emptyNetworks: INetwork[] = [];

const ethereumId: NetworkId = 'Ethereum';
const ropstenId: NetworkId = 'Ropsten';
const someNetworks: INetwork[] = ([
  {
    ...NETWORKS_CONFIG[ethereumId],
    nodes: NODES_CONFIG[ethereumId]
  },
  {
    ...NETWORKS_CONFIG[ropstenId],
    nodes: NODES_CONFIG[ropstenId]
  }
] as unknown) as INetwork[];

const toggleFlipped = () => undefined;

const networkNodesEmpty = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '900px' }}>
    <NetworkNodes networks={emptyNetworks} toggleFlipped={toggleFlipped} />
  </div>
);

const someNetworkNode = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '900px' }}>
    <NetworkNodes networks={someNetworks} toggleFlipped={toggleFlipped} />
  </div>
);

storiesOf('NetworkNodes', module)
  .addDecorator(story => <AppProviders>{story()}</AppProviders>)
  .add('Empty', _ => networkNodesEmpty(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  })
  .add('Some networks', _ => someNetworkNode(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  });
