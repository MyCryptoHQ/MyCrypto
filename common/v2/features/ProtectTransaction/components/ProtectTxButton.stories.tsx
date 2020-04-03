import React from 'react';
import { storiesOf } from '@storybook/react';
import noop from 'lodash/noop';
import { ProtectTxButton } from './ProtectTxButton';

const ProtectTransactionButton = () => (
  <div style={{ maxWidth: '500px', position: 'relative' }}>
    <ProtectTxButton onClick={noop} />
  </div>
);

storiesOf('ProtectTransaction', module).add(
  'Protect transaction button',
  _ => ProtectTransactionButton(),
  {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  }
);
