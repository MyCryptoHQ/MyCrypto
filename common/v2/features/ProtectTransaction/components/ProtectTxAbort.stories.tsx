import React from 'react';
import { storiesOf } from '@storybook/react';
import noop from 'lodash/noop';
import { ProtectTxAbort } from './ProtectTxAbort';
import { ProtectTxProvider } from '../index';

const AbortTransaction = () => (
  <div style={{ width: '700px', position: 'relative' }}>
    <ProtectTxAbort onTxSent={noop} />
  </div>
);

storiesOf('ProtectTransaction', module)
  .addDecorator(story => <ProtectTxProvider>{story()}</ProtectTxProvider>)
  .add('Abort transaction', _ => AbortTransaction(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
