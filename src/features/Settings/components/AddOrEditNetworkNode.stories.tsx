import React, { ReactNode } from 'react';

import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { ProvidersWrapper } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { customNodeConfig, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext } from '@services';
import { theme } from '@theme';
import { noOp } from '@utils';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';

const networkId = DEFAULT_NETWORK;

const wrapInProvider = (component: ReactNode) => (
  <ProvidersWrapper>
    <DataContext.Provider
      value={
        ({
          createActions: noOp,
          userActions: [],
          networks: fNetworks,
          settings: fSettings
        } as unknown) as IDataContext
      }
    >
      {component}
    </DataContext.Provider>
  </ProvidersWrapper>
);

const addNetworkNode = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode
      networkId={networkId}
      editNode={undefined}
      onComplete={noOp}
      isAddingCustomNetwork={false}
    />
  </div>
);

const editNetworkNode = wrapInProvider(
  <div className="sb-container" style={{ maxWidth: '800px' }}>
    <AddOrEditNetworkNode
      networkId={networkId}
      editNode={customNodeConfig}
      onComplete={noOp}
      isAddingCustomNetwork={false}
    />
  </div>
);

storiesOf('NetworkNodeForm', module)
  .addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>)
  .add('Add node', () => addNetworkNode, {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  })
  .add('Edit node', () => editNetworkNode, {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  });
