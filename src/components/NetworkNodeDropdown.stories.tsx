import { storiesOf } from '@storybook/react';

import { DEFAULT_NETWORK } from '@config';

import NetworkNodeDropdown from './NetworkNodeDropdown';

const onEdit = () => undefined;

const selectOnly = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <NetworkNodeDropdown networkId={DEFAULT_NETWORK} />
  </div>
);

const withAdd = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <NetworkNodeDropdown networkId={DEFAULT_NETWORK} onEdit={onEdit} />
  </div>
);

storiesOf('Molecules/Selectors/NetworkNodesDropdown', module)
  .add('Select', () => selectOnly(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  })
  .add('Select with add', () => withAdd(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
    }
  });
